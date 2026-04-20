import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Restaurants from './components/pages/Restaurants';
import RestaurantDetail from './components/pages/RestaurantDetail';
import Cart from './components/pages/Cart';
import Orders from './components/pages/Orders';
import Payment from './components/pages/Payment';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }
          }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/restaurants" replace />} />

            <Route path="/restaurants" element={
              <PrivateRoute><AppLayout><Restaurants /></AppLayout></PrivateRoute>
            } />
            <Route path="/restaurants/:id" element={
              <PrivateRoute><AppLayout><RestaurantDetail /></AppLayout></PrivateRoute>
            } />
            <Route path="/cart" element={
              <PrivateRoute><AppLayout><Cart /></AppLayout></PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute><AppLayout><Orders /></AppLayout></PrivateRoute>
            } />
            <Route path="/payment" element={
              <PrivateRoute><AppLayout><Payment /></AppLayout></PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/restaurants" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
