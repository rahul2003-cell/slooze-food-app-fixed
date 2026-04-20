package com.slooze.foodapp.service;

import com.slooze.foodapp.entity.*;
import com.slooze.foodapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private UserRepository userRepository;

    public List<Restaurant> getRestaurantsForUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        // ADMIN sees all, MANAGER/MEMBER see only their country
        if (user.getRole() == Role.ADMIN) {
            return restaurantRepository.findAll();
        }
        return restaurantRepository.findByCountry(user.getCountry());
    }

    public Restaurant getRestaurantForUser(Long restaurantId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (user.getRole() != Role.ADMIN && restaurant.getCountry() != user.getCountry()) {
            throw new RuntimeException("Access denied: restaurant not in your region");
        }
        return restaurant;
    }

    public List<MenuItem> getMenuForRestaurant(Long restaurantId, String username) {
        // Access check via restaurant
        getRestaurantForUser(restaurantId, username);
        return menuItemRepository.findByRestaurantId(restaurantId);
    }
}
