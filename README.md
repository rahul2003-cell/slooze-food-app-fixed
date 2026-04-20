# 🍔 Slooze Food Ordering Application

A full-stack food ordering web application built for Slooze's take-home assignment.
Implements **RBAC (Role-Based Access Control)** and **Country-based relational access**.

---

## 👥 Users & Credentials

| User | Username | Password | Role | Country |
|------|----------|----------|------|---------|
| Nick Fury | `nickfury` | `admin123` | ADMIN | Global |
| Captain Marvel | `captainmarvel` | `manager123` | MANAGER | India |
| Captain America | `captainamerica` | `manager123` | MANAGER | America |
| Thanos | `thanos` | `member123` | MEMBER | India |
| Thor | `thor` | `member123` | MEMBER | India |
| Travis | `travis` | `member123` | MEMBER | America |

---

## 🔐 Access Control Matrix

| Function | ADMIN | MANAGER | MEMBER |
|----------|-------|---------|--------|
| View Restaurants & Menu | ✅ All | ✅ Own country only | ✅ Own country only |
| Create Order (add items) | ✅ | ✅ | ✅ |
| Place Order (checkout & pay) | ✅ | ✅ | ❌ |
| Cancel Order | ✅ | ✅ | ❌ |
| Manage Payment Methods | ✅ | ❌ | ❌ |

---

## 🛠️ Tech Stack

**Backend:** Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, MySQL  
**Frontend:** React 18, React Router 6, Axios, React Hot Toast  
**Database:** MySQL 8+

---

## ⚙️ Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+
- npm 9+

---

## 🚀 Running Locally

### Step 1: Setup MySQL Database

Log into MySQL and run:

```sql
CREATE DATABASE slooze_food_db;
```

The app will auto-create tables on first start (via `spring.jpa.hibernate.ddl-auto=update`).

### Step 2: Configure Database Credentials

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/slooze_food_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3: Start the Backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend runs on: **http://localhost:8080**

On first start, the `DataSeeder` will automatically populate:
- 6 users (1 admin, 2 managers, 3 members)
- 6 restaurants (3 India, 3 America)
- 20+ menu items
- Payment methods for admin and managers

### Step 4: Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns JWT token |

### Restaurants
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/restaurants` | All | List restaurants (filtered by country) |
| GET | `/api/restaurants/{id}` | All | Get restaurant details |
| GET | `/api/restaurants/{id}/menu` | All | Get menu items |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders/create` | All | Create order / add items |
| POST | `/api/orders/{id}/place` | Admin, Manager | Checkout & pay |
| POST | `/api/orders/{id}/cancel` | Admin, Manager | Cancel order |
| GET | `/api/orders/my` | All | View my orders |
| GET | `/api/orders/{id}` | All | View specific order |

### Payment Methods
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/payment` | All | List payment methods |
| POST | `/api/payment` | Admin only | Add payment method |
| PUT | `/api/payment/{id}` | Admin only | Update payment method |
| DELETE | `/api/payment/{id}` | Admin only | Delete payment method |

---

## 🏗️ Architecture

```
slooze-food-app/
├── backend/                         # Spring Boot Application
│   └── src/main/java/com/slooze/foodapp/
│       ├── config/
│       │   ├── SecurityConfig.java  # Spring Security + CORS config
│       │   └── DataSeeder.java      # Initial data population
│       ├── controller/              # REST API Controllers
│       ├── dto/                     # Data Transfer Objects
│       ├── entity/                  # JPA Entities (User, Order, etc.)
│       ├── repository/              # Spring Data JPA Repositories
│       ├── security/                # JWT Auth Filter & Utils
│       └── service/                 # Business Logic + RBAC enforcement
│
└── frontend/                        # React Application
    └── src/
        ├── components/
│       │   ├── auth/                # Login, PrivateRoute
│       │   ├── layout/              # Navbar
│       │   └── pages/               # Restaurants, Cart, Orders, Payment
│       ├── context/                 # AuthContext, CartContext
│       └── services/
│           └── api.js               # Axios API service
```

## 🌍 Bonus: Country-Based Relational Access

- **ADMIN (Nick Fury):** Sees ALL restaurants globally, can manage all payment methods
- **MANAGER-India (Captain Marvel):** Sees only India restaurants, can place/cancel orders for India
- **MANAGER-America (Captain America):** Sees only America restaurants, can place/cancel orders for America
- **MEMBER-India (Thanos/Thor):** Sees only India restaurants, can add to cart but cannot checkout
- **MEMBER-America (Travis):** Sees only America restaurants, can add to cart but cannot checkout

Country filtering is enforced at the **service layer** on every API call, not just the UI.

---

## 🗄️ Database Schema

- `users` — id, username, password, full_name, role (ADMIN/MANAGER/MEMBER), country (INDIA/AMERICA/null)
- `restaurants` — id, name, address, cuisine, image_url, rating, country
- `menu_items` — id, name, description, price, category, image_url, restaurant_id
- `orders` — id, user_id, restaurant_id, status (CART/PLACED/CANCELLED), total_amount, payment_method_id, created_at, placed_at, cancelled_at
- `order_items` — id, order_id, menu_item_id, quantity, price
- `payment_methods` — id, user_id, card_holder_name, card_last_four, card_type, expiry_month, expiry_year, is_default

---

## 📦 Postman Collection

Import the file `Slooze_API_Collection.json` (included in root) to Postman to test all APIs.
Set environment variable `token` after login and it will be used in all subsequent requests.
