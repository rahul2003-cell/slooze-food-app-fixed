package com.slooze.foodapp.dto;

import lombok.Data;

@Data
public class PaymentMethodRequest {
    private String cardHolderName;
    private String cardLastFour;
    private String cardType;
    private String expiryMonth;
    private String expiryYear;
    private Boolean isDefault;
}
