package com.slooze.foodapp.repository;

import com.slooze.foodapp.entity.Order;
import com.slooze.foodapp.entity.OrderStatus;
import com.slooze.foodapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserAndStatus(User user, OrderStatus status);
    Optional<Order> findFirstByUserAndStatus(User user, OrderStatus status);
}
