package com.slooze.foodapp.controller;

import com.slooze.foodapp.dto.ApiResponse;
import com.slooze.foodapp.dto.PaymentMethodRequest;
import com.slooze.foodapp.entity.PaymentMethod;
import com.slooze.foodapp.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentMethod>>> getMyPaymentMethods(Principal principal) {
        List<PaymentMethod> methods = paymentMethodService.getMyPaymentMethods(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(methods));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentMethod>> addPaymentMethod(
            @RequestBody PaymentMethodRequest request, Principal principal) {
        try {
            PaymentMethod pm = paymentMethodService.addPaymentMethod(request, principal.getName());
            return ResponseEntity.ok(ApiResponse.success("Payment method added", pm));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentMethod>> updatePaymentMethod(
            @PathVariable Long id,
            @RequestBody PaymentMethodRequest request,
            Principal principal) {
        try {
            PaymentMethod pm = paymentMethodService.updatePaymentMethod(id, request, principal.getName());
            return ResponseEntity.ok(ApiResponse.success("Payment method updated", pm));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePaymentMethod(@PathVariable Long id, Principal principal) {
        try {
            paymentMethodService.deletePaymentMethod(id, principal.getName());
            return ResponseEntity.ok(ApiResponse.success("Payment method deleted", null));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        }
    }
}
