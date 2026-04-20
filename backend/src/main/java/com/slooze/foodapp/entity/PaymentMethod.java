package com.slooze.foodapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_methods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"paymentMethods", "orders", "password", "hibernateLazyInitializer", "handler"})
    private User user;

    @Column(nullable = false)
    private String cardHolderName;

    @Column(nullable = false)
    private String cardLastFour;

    @Column(nullable = false)
    private String cardType;

    @Column(nullable = false)
    private String expiryMonth;

    @Column(nullable = false)
    private String expiryYear;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;
}
