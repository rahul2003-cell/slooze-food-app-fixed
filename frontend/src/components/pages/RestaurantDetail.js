import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurant, getMenu } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartRestaurant, addToCart, removeFromCart, totalItems, totalAmount } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    Promise.all([getRestaurant(id), getMenu(id)])
      .then(([rRes, mRes]) => {
        setRestaurant(rRes.data.data);
        setMenuItems(mRes.data.data || []);
      })
      .catch(() => toast.error('Access denied or restaurant not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const categories = ['All', ...new Set(menuItems.map(m => m.category))];
  const filtered = activeCategory === 'All' ? menuItems : menuItems.filter(m => m.category === activeCategory);

  const getQty = (itemId) => {
    const found = cartItems.find(c => c.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleAdd = (item) => {
    if (cartRestaurant && cartRestaurant.id !== restaurant.id) {
      if (!window.confirm('Your cart has items from another restaurant. Clear cart and start fresh?')) return;
    }
    addToCart(item, restaurant);
    toast.success(`${item.name} added to cart`);
  };

  if (loading) return <div style={styles.loading}>Loading menu...</div>;
  if (!restaurant) return <div style={styles.loading}>Restaurant not found or access denied.</div>;

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <img src={restaurant.imageUrl} alt={restaurant.name} style={styles.heroImg}
          onError={e => e.target.src = 'https://via.placeholder.com/1280x300?text=Restaurant'} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <button style={styles.back} onClick={() => navigate('/restaurants')}>← Back</button>
          <h1 style={styles.heroTitle}>{restaurant.name}</h1>
          <div style={styles.heroMeta}>
            <span>🍽️ {restaurant.cuisine}</span>
            <span>⭐ {restaurant.rating}</span>
            <span>📍 {restaurant.address}</span>
            <span style={styles.countryTag}>
              {restaurant.country === 'INDIA' ? '🇮🇳' : '🇺🇸'} {restaurant.country}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.body}>
        {/* Category tabs */}
        <div style={styles.tabs}>
          {categories.map(cat => (
            <button key={cat} style={{ ...styles.tab, ...(activeCategory === cat ? styles.tabActive : {}) }}
              onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.layout}>
          {/* Menu items */}
          <div style={styles.menuGrid}>
            {filtered.map(item => {
              const qty = getQty(item.id);
              return (
                <div key={item.id} style={styles.card}>
                  <img src={item.imageUrl} alt={item.name} style={styles.itemImg}
                    onError={e => e.target.src = 'https://via.placeholder.com/300x150?text=Food'} />
                  <div style={styles.cardBody}>
                    <div style={styles.catLabel}>{item.category}</div>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemDesc}>{item.description}</p>
                    <div style={styles.itemFooter}>
                      <span style={styles.price}>${item.price.toFixed(2)}</span>
                      {qty === 0 ? (
                        <button style={styles.addBtn} onClick={() => handleAdd(item)}>+ Add</button>
                      ) : (
                        <div style={styles.qtyControls}>
                          <button style={styles.qtyBtn} onClick={() => removeFromCart(item.id)}>−</button>
                          <span style={styles.qty}>{qty}</span>
                          <button style={styles.qtyBtn} onClick={() => handleAdd(item)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart sidebar */}
          {totalItems > 0 && (
            <div style={styles.cartSidebar}>
              <h3 style={styles.cartTitle}>🛒 Your Cart</h3>
              <div style={styles.cartItems}>
                {cartItems.map(ci => (
                  <div key={ci.menuItem.id} style={styles.cartItem}>
                    <div style={styles.ciName}>{ci.menuItem.name}</div>
                    <div style={styles.ciRight}>
                      <span style={styles.ciQty}>×{ci.quantity}</span>
                      <span style={styles.ciPrice}>${(ci.menuItem.price * ci.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.cartTotal}>
                <span>Total</span>
                <span style={styles.totalAmt}>${totalAmount.toFixed(2)}</span>
              </div>
              <button style={styles.checkoutBtn} onClick={() => navigate('/cart')}>
                Proceed to Checkout →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', background: '#f8f9fa' },
  loading: { textAlign: 'center', padding: '80px', color: '#9ca3af', fontSize: '18px' },
  hero: { position: 'relative', height: '280px', overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))' },
  heroContent: { position: 'absolute', bottom: '24px', left: '24px', color: '#fff' },
  back: {
    background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', marginBottom: '12px', display: 'block'
  },
  heroTitle: { fontSize: '32px', fontWeight: 800, marginBottom: '10px' },
  heroMeta: { display: 'flex', gap: '20px', fontSize: '14px', flexWrap: 'wrap', alignItems: 'center' },
  countryTag: {
    background: 'rgba(255,107,53,0.8)', padding: '3px 10px',
    borderRadius: '20px', fontWeight: 600
  },
  body: { maxWidth: '1280px', margin: '0 auto', padding: '24px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    padding: '8px 16px', borderRadius: '20px', border: '1.5px solid #e5e7eb',
    background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
    color: '#6b7280', transition: 'all 0.2s'
  },
  tabActive: { background: '#ff6b35', borderColor: '#ff6b35', color: '#fff' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  menuGrid: {
    flex: 1, display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px'
  },
  card: { background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  itemImg: { width: '100%', height: '150px', objectFit: 'cover' },
  cardBody: { padding: '14px' },
  catLabel: {
    fontSize: '10px', fontWeight: 700, color: '#ff6b35', textTransform: 'uppercase',
    letterSpacing: '0.5px', marginBottom: '4px'
  },
  itemName: { fontSize: '15px', fontWeight: 700, color: '#1f2937', marginBottom: '4px' },
  itemDesc: { fontSize: '12px', color: '#6b7280', marginBottom: '12px', lineHeight: 1.4 },
  itemFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '16px', fontWeight: 700, color: '#1f2937' },
  addBtn: {
    padding: '7px 16px', background: '#ff6b35', color: '#fff', border: 'none',
    borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
  },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: {
    width: '28px', height: '28px', borderRadius: '8px', border: '1.5px solid #ff6b35',
    background: '#fff', color: '#ff6b35', fontSize: '16px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
  },
  qty: { fontSize: '15px', fontWeight: 700, minWidth: '20px', textAlign: 'center' },
  cartSidebar: {
    width: '300px', background: '#fff', borderRadius: '16px', padding: '20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)', position: 'sticky', top: '84px'
  },
  cartTitle: { fontSize: '17px', fontWeight: 700, marginBottom: '16px', color: '#1f2937' },
  cartItems: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ciName: { fontSize: '13px', color: '#374151', flex: 1 },
  ciRight: { display: 'flex', gap: '8px', alignItems: 'center' },
  ciQty: { fontSize: '12px', color: '#9ca3af' },
  ciPrice: { fontSize: '13px', fontWeight: 600, color: '#1f2937' },
  cartTotal: {
    display: 'flex', justifyContent: 'space-between', padding: '12px 0',
    borderTop: '1px solid #f3f4f6', marginBottom: '14px',
    fontSize: '15px', fontWeight: 600, color: '#1f2937'
  },
  totalAmt: { color: '#ff6b35', fontSize: '18px' },
  checkoutBtn: {
    width: '100%', padding: '12px', background: 'linear-gradient(135deg, #ff6b35, #e55a24)',
    color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700,
    fontSize: '14px', cursor: 'pointer'
  },
};
