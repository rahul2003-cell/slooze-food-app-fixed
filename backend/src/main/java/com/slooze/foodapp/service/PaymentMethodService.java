package com.slooze.foodapp.service;

import com.slooze.foodapp.dto.PaymentMethodRequest;
import com.slooze.foodapp.entity.*;
import com.slooze.foodapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentMethodService {

    @Autowired private PaymentMethodRepository paymentMethodRepository;
    @Autowired private UserRepository userRepository;

    public List<PaymentMethod> getMyPaymentMethods(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return paymentMethodRepository.findByUser(user);
    }

    @Transactional
    public PaymentMethod addPaymentMethod(PaymentMethodRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: Only Admin can manage payment methods");
        }

        PaymentMethod pm = PaymentMethod.builder()
                .user(user)
                .cardHolderName(request.getCardHolderName())
                .cardLastFour(request.getCardLastFour())
                .cardType(request.getCardType())
                .expiryMonth(request.getExpiryMonth())
                .expiryYear(request.getExpiryYear())
                .isDefault(request.getIsDefault() != null && request.getIsDefault())
                .build();

        return paymentMethodRepository.save(pm);
    }

    @Transactional
    public PaymentMethod updatePaymentMethod(Long id, PaymentMethodRequest request, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: Only Admin can manage payment methods");
        }

        PaymentMethod pm = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        pm.setCardHolderName(request.getCardHolderName());
        pm.setCardLastFour(request.getCardLastFour());
        pm.setCardType(request.getCardType());
        pm.setExpiryMonth(request.getExpiryMonth());
        pm.setExpiryYear(request.getExpiryYear());
        if (request.getIsDefault() != null) pm.setIsDefault(request.getIsDefault());

        return paymentMethodRepository.save(pm);
    }

    @Transactional
    public void deletePaymentMethod(Long id, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: Only Admin can manage payment methods");
        }
        paymentMethodRepository.deleteById(id);
    }
}
