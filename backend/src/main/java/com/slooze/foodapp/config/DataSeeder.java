package com.slooze.foodapp.config;

import com.slooze.foodapp.entity.*;
import com.slooze.foodapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private PaymentMethodRepository paymentMethodRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return; // Already seeded

        // ---- USERS ----
        User nickFury = userRepository.save(User.builder()
                .username("nickfury").password(passwordEncoder.encode("admin123"))
                .fullName("Nick Fury").role(Role.ADMIN).country(null).build());

        User captainMarvel = userRepository.save(User.builder()
                .username("captainmarvel").password(passwordEncoder.encode("manager123"))
                .fullName("Captain Marvel").role(Role.MANAGER).country(Country.INDIA).build());

        User captainAmerica = userRepository.save(User.builder()
                .username("captainamerica").password(passwordEncoder.encode("manager123"))
                .fullName("Captain America").role(Role.MANAGER).country(Country.AMERICA).build());

        User thanos = userRepository.save(User.builder()
                .username("thanos").password(passwordEncoder.encode("member123"))
                .fullName("Thanos").role(Role.MEMBER).country(Country.INDIA).build());

        User thor = userRepository.save(User.builder()
                .username("thor").password(passwordEncoder.encode("member123"))
                .fullName("Thor").role(Role.MEMBER).country(Country.INDIA).build());

        User travis = userRepository.save(User.builder()
                .username("travis").password(passwordEncoder.encode("member123"))
                .fullName("Travis").role(Role.MEMBER).country(Country.AMERICA).build());

        // ---- PAYMENT METHODS ----
        paymentMethodRepository.save(PaymentMethod.builder()
                .user(nickFury).cardHolderName("Nick Fury")
                .cardLastFour("4242").cardType("VISA")
                .expiryMonth("12").expiryYear("2026").isDefault(true).build());

        paymentMethodRepository.save(PaymentMethod.builder()
                .user(captainMarvel).cardHolderName("Captain Marvel")
                .cardLastFour("1234").cardType("MASTERCARD")
                .expiryMonth("08").expiryYear("2027").isDefault(true).build());

        paymentMethodRepository.save(PaymentMethod.builder()
                .user(captainAmerica).cardHolderName("Captain America")
                .cardLastFour("5678").cardType("VISA")
                .expiryMonth("03").expiryYear("2028").isDefault(true).build());

        // ---- INDIA RESTAURANTS ----
        Restaurant biryaniHouse = restaurantRepository.save(Restaurant.builder()
                .name("Biryani House").address("123 MG Road, Bangalore")
                .cuisine("Indian").imageUrl("https://images.unsplash.com/photo-1563379091339-03246963d651?w=400")
                .rating(4.5).country(Country.INDIA).build());

        Restaurant spiceCourt = restaurantRepository.save(Restaurant.builder()
                .name("Spice Court").address("45 Jubilee Hills, Hyderabad")
                .cuisine("South Indian").imageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400")
                .rating(4.2).country(Country.INDIA).build());

        Restaurant mumbaiDhabha = restaurantRepository.save(Restaurant.builder()
                .name("Mumbai Dhaba").address("7 Marine Drive, Mumbai")
                .cuisine("Street Food").imageUrl("https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400")
                .rating(4.0).country(Country.INDIA).build());

        // ---- AMERICA RESTAURANTS ----
        Restaurant burgerBarn = restaurantRepository.save(Restaurant.builder()
                .name("Burger Barn").address("500 5th Ave, New York")
                .cuisine("American").imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400")
                .rating(4.3).country(Country.AMERICA).build());

        Restaurant pizzaPalace = restaurantRepository.save(Restaurant.builder()
                .name("Pizza Palace").address("221 Hollywood Blvd, Los Angeles")
                .cuisine("Italian-American").imageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400")
                .rating(4.6).country(Country.AMERICA).build());

        Restaurant texasBBQ = restaurantRepository.save(Restaurant.builder()
                .name("Texas BBQ").address("88 Bourbon St, Houston")
                .cuisine("BBQ").imageUrl("https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400")
                .rating(4.4).country(Country.AMERICA).build());

        // ---- MENU ITEMS - INDIA ----
        menuItemRepository.save(MenuItem.builder().restaurant(biryaniHouse).name("Chicken Biryani")
                .description("Aromatic basmati rice with tender chicken").price(12.99).category("Main Course")
                .imageUrl("https://images.unsplash.com/photo-1563379091339-03246963d651?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(biryaniHouse).name("Mutton Biryani")
                .description("Slow cooked mutton with saffron rice").price(15.99).category("Main Course")
                .imageUrl("https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(biryaniHouse).name("Veg Biryani")
                .description("Fresh vegetables in spiced basmati rice").price(9.99).category("Main Course")
                .imageUrl("https://images.unsplash.com/photo-1626100134745-a6a4caf95f79?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(biryaniHouse).name("Raita")
                .description("Cool yogurt with cucumber and mint").price(2.99).category("Sides")
                .imageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300").build());

        menuItemRepository.save(MenuItem.builder().restaurant(spiceCourt).name("Masala Dosa")
                .description("Crispy crepe with spiced potato filling").price(7.99).category("Breakfast")
                .imageUrl("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(spiceCourt).name("Idli Sambar")
                .description("Steamed rice cakes with lentil soup").price(6.49).category("Breakfast")
                .imageUrl("https://images.unsplash.com/photo-1630383249896-424e482df921?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(spiceCourt).name("Butter Chicken")
                .description("Tender chicken in rich tomato-butter gravy").price(13.99).category("Main Course")
                .imageUrl("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300").build());

        menuItemRepository.save(MenuItem.builder().restaurant(mumbaiDhabha).name("Pav Bhaji")
                .description("Spiced vegetable curry with buttered buns").price(5.99).category("Street Food")
                .imageUrl("https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(mumbaiDhabha).name("Vada Pav")
                .description("Spiced potato fritter in a bun").price(3.99).category("Street Food")
                .imageUrl("https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(mumbaiDhabha).name("Pani Puri")
                .description("Crispy shells with tangy tamarind water").price(4.99).category("Snacks")
                .imageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300").build());

        // ---- MENU ITEMS - AMERICA ----
        menuItemRepository.save(MenuItem.builder().restaurant(burgerBarn).name("Classic Cheeseburger")
                .description("Beef patty with cheddar, lettuce, tomato").price(11.99).category("Burgers")
                .imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(burgerBarn).name("Bacon Burger")
                .description("Double beef with crispy bacon").price(13.99).category("Burgers")
                .imageUrl("https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(burgerBarn).name("Fries")
                .description("Golden crispy fries with sea salt").price(3.99).category("Sides")
                .imageUrl("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(burgerBarn).name("Milkshake")
                .description("Creamy vanilla or chocolate shake").price(5.49).category("Drinks")
                .imageUrl("https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300").build());

        menuItemRepository.save(MenuItem.builder().restaurant(pizzaPalace).name("Margherita Pizza")
                .description("Classic tomato sauce, mozzarella, basil").price(14.99).category("Pizza")
                .imageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(pizzaPalace).name("Pepperoni Pizza")
                .description("Loaded pepperoni on rich tomato base").price(16.99).category("Pizza")
                .imageUrl("https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(pizzaPalace).name("Caesar Salad")
                .description("Romaine, croutons, parmesan, caesar dressing").price(8.99).category("Salads")
                .imageUrl("https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300").build());

        menuItemRepository.save(MenuItem.builder().restaurant(texasBBQ).name("BBQ Brisket")
                .description("Slow-smoked beef brisket with house sauce").price(18.99).category("BBQ")
                .imageUrl("https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(texasBBQ).name("Pulled Pork Sandwich")
                .description("Tender pulled pork on a toasted brioche").price(12.99).category("BBQ")
                .imageUrl("https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300").build());
        menuItemRepository.save(MenuItem.builder().restaurant(texasBBQ).name("Mac & Cheese")
                .description("Creamy Southern-style macaroni and cheese").price(6.99).category("Sides")
                .imageUrl("https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=300").build());

        System.out.println("✅ Database seeded successfully!");
    }
}
