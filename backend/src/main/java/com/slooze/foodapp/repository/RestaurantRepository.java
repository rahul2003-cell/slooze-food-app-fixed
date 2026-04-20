package com.slooze.foodapp.repository;

import com.slooze.foodapp.entity.Country;
import com.slooze.foodapp.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByCountry(Country country);
}
