package com.slooze.foodapp.controller;

import com.slooze.foodapp.dto.ApiResponse;
import com.slooze.foodapp.dto.CreateOrderRequest;
import com.slooze.foodapp.entity.Order;
import com.slooze.foodapp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody CreateOrderRequest request, Principal principal) {
        try {
            Order order = orderService.createOrder(request, principal.getName());
            return ResponseEntity.ok(ApiResponse.success("Order created", order));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{orderId}/place")
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, Long> body,
            Principal principal) {
        try {
            Long paymentMethodId = body.get("paymentMethodId");
            Order order = orderService.placeOrder(orderId, paymentMethodId, principal.getName());
            return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(@PathVariable Long orderId, Principal principal) {
        try {
            Order order = orderService.cancelOrder(orderId, principal.getName());
            return ResponseEntity.ok(ApiResponse.success("Order cancelled", order));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(Principal principal) {
        try {
            List<Order> orders = orderService.getMyOrders(principal.getName());
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable Long orderId, Principal principal) {
        try {
            Order order = orderService.getOrderById(orderId, principal.getName());
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        }
    }
}
