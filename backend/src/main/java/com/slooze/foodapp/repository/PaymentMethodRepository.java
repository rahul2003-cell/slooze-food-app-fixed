package com.slooze.foodapp.repository;

import com.slooze.foodapp.entity.PaymentMethod;
import com.slooze.foodapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByUser(User user);
}
