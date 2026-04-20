package com.slooze.foodapp.controller;

import com.slooze.foodapp.dto.ApiResponse;
import com.slooze.foodapp.entity.MenuItem;
import com.slooze.foodapp.entity.Restaurant;
import com.slooze.foodapp.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Restaurant>>> getRestaurants(Principal principal) {
        try {
            List<Restaurant> restaurants = restaurantService.getRestaurantsForUser(principal.getName());
            return ResponseEntity.ok(ApiResponse.success(restaurants));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> getRestaurant(@PathVariable Long id, Principal principal) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantForUser(id, principal.getName());
            return ResponseEntity.ok(ApiResponse.success(restaurant));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenu(@PathVariable Long id, Principal principal) {
        try {
            List<MenuItem> items = restaurantService.getMenuForRestaurant(id, principal.getName());
            return ResponseEntity.ok(ApiResponse.success(items));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        }
    }
}
