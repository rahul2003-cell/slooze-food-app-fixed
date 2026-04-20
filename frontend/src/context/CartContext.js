import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);

  const addToCart = (menuItem, restaurant) => {
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
      // Different restaurant - clear cart first
      setCartItems([]);
      setCartRestaurant(restaurant);
    } else if (!cartRestaurant) {
      setCartRestaurant(restaurant);
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId) => {
    setCartItems(prev => {
      const updated = prev.map(i =>
        i.menuItem.id === menuItemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      ).filter(i => i.quantity > 0);
      if (updated.length === 0) setCartRestaurant(null);
      return updated;
    });
  };

  const removeItemCompletely = (menuItemId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.menuItem.id !== menuItemId);
      if (updated.length === 0) setCartRestaurant(null);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
  };

  const totalAmount = cartItems.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartRestaurant,
      addToCart, removeFromCart, removeItemCompletely,
      clearCart, totalAmount, totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
