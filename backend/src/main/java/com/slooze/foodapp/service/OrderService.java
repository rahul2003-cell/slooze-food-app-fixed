package com.slooze.foodapp.service;

import com.slooze.foodapp.dto.CreateOrderRequest;
import com.slooze.foodapp.dto.OrderItemRequest;
import com.slooze.foodapp.entity.*;
import com.slooze.foodapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private PaymentMethodRepository paymentMethodRepository;

    @Transactional
    public Order createOrder(CreateOrderRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Country check for non-admins
        if (user.getRole() != Role.ADMIN && restaurant.getCountry() != user.getCountry()) {
            throw new RuntimeException("Access denied: restaurant not in your region");
        }

        Order order = Order.builder()
                .user(user)
                .restaurant(restaurant)
                .status(OrderStatus.CART)
                .items(new ArrayList<>())
                .totalAmount(0.0)
                .build();

        order = orderRepository.save(order);

        double total = 0.0;
        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemReq.getMenuItemId()));

            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .price(menuItem.getPrice())
                    .build();
            order.getItems().add(oi);
            total += menuItem.getPrice() * itemReq.getQuantity();
        }
        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    @Transactional
    public Order placeOrder(Long orderId, Long paymentMethodId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();

        // Only ADMIN and MANAGER can place orders
        if (user.getRole() == Role.MEMBER) {
            throw new RuntimeException("Access denied: Members cannot place orders");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // User can only place their own orders; ADMIN can place any
        if (user.getRole() != Role.ADMIN && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: not your order");
        }

        if (order.getStatus() != OrderStatus.CART) {
            throw new RuntimeException("Order is not in CART status");
        }

        PaymentMethod pm = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        // Only ADMIN can use any payment method; others must own it
        if (user.getRole() != Role.ADMIN && !pm.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: not your payment method");
        }

        order.setStatus(OrderStatus.PLACED);
        order.setPlacedAt(LocalDateTime.now());
        order.setPaymentMethod(pm);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();

        // Only ADMIN and MANAGER can cancel orders
        if (user.getRole() == Role.MEMBER) {
            throw new RuntimeException("Access denied: Members cannot cancel orders");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (user.getRole() != Role.ADMIN && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: not your order");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Order already cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getMyOrders(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return orderRepository.findByUser(user);
    }

    public Order getOrderById(Long orderId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (user.getRole() != Role.ADMIN && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return order;
    }
}
