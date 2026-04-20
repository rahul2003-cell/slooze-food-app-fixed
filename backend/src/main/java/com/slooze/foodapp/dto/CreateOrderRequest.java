package com.slooze.foodapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long restaurantId;
    private List<OrderItemRequest> items;
}
