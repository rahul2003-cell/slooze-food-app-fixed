package com.slooze.foodapp.entity;

public enum OrderStatus {
    CART,       // Items added, not yet placed
    PLACED,     // Checkout done, payment made
    CANCELLED   // Order cancelled
}
