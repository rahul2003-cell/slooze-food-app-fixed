import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, placeOrder, getPaymentMethods } from '../../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartRestaurant, removeFromCart, addToCart, removeItemCompletely, clearCart, totalAmount } = useCart();
  const { canPlaceOrder } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPM, setSelectedPM] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (canPlaceOrder()) {
      getPaymentMethods().then(res => {
        const methods = res.data.data || [];
        setPaymentMethods(methods);
        const def = methods.find(m => m.isDefault);
        if (def) setSelectedPM(def.id);
        else if (methods.length > 0) setSelectedPM(methods[0].id);
      }).catch(() => {});
    }
  }, []);

  const handleCheckout = async () => {
    if (!canPlaceOrder()) {
      toast.error('You do not have permission to place orders');
      return;
    }
    if (!selectedPM) {
      toast.error('Please select a payment method');
      return;
    }
    setLoading(true);
    try {
      const orderPayload = {
        restaurantId: cartRestaurant.id,
        items: cartItems.map(ci => ({ menuItemId: ci.menuItem.id, quantity: ci.quantity }))
      };
      const orderRes = await createOrder(orderPayload);
      const orderId = orderRes.data.data.id;
      await placeOrder(orderId, selectedPM);
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptySub}>Browse restaurants and add items to your cart</p>
        <button style={styles.browseBtn} onClick={() => navigate('/restaurants')}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛒 Your Cart</h1>
        <p style={styles.sub}>from <strong>{cartRestaurant?.name}</strong></p>
      </div>

      <div style={styles.layout}>
        {/* Items */}
        <div style={styles.items}>
          <div style={styles.section}>
            <h2 style={styles.secTitle}>Order Items</h2>
            {cartItems.map(ci => (
              <div key={ci.menuItem.id} style={styles.item}>
                <img src={ci.menuItem.imageUrl} alt={ci.menuItem.name} style={styles.itemImg}
                  onError={e => e.target.src = 'https://via.placeholder.com/80?text=Food'} />
                <div style={styles.itemInfo}>
                  <div style={styles.itemName}>{ci.menuItem.name}</div>
                  <div style={styles.itemPrice}>${ci.menuItem.price.toFixed(2)} each</div>
                </div>
                <div style={styles.qtyCtrl}>
                  <button style={styles.qBtn} onClick={() => removeFromCart(ci.menuItem.id)}>−</button>
                  <span style={styles.qNum}>{ci.quantity}</span>
                  <button style={styles.qBtn} onClick={() => addToCart(ci.menuItem, cartRestaurant)}>+</button>
                </div>
                <div style={styles.subtotal}>${(ci.menuItem.price * ci.quantity).toFixed(2)}</div>
                <button style={styles.removeBtn} onClick={() => removeItemCompletely(ci.menuItem.id)}>✕</button>
              </div>
            ))}
          </div>

          {/* Payment method */}
          {canPlaceOrder() ? (
            <div style={styles.section}>
              <h2 style={styles.secTitle}>💳 Payment Method</h2>
              {paymentMethods.length === 0 ? (
                <div style={styles.noPM}>
                  No payment methods found. Ask admin to add one.
                </div>
              ) : (
                <div style={styles.pmGrid}>
                  {paymentMethods.map(pm => (
                    <div key={pm.id}
                      style={{ ...styles.pmCard, ...(selectedPM == pm.id ? styles.pmActive : {}) }}
                      onClick={() => setSelectedPM(pm.id)}>
                      <div style={styles.pmTop}>
                        <span style={styles.pmType}>{pm.cardType}</span>
                        {pm.isDefault && <span style={styles.pmDefault}>Default</span>}
                      </div>
                      <div style={styles.pmNumber}>•••• •••• •••• {pm.cardLastFour}</div>
                      <div style={styles.pmBottom}>
                        <span>{pm.cardHolderName}</span>
                        <span>{pm.expiryMonth}/{pm.expiryYear}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={styles.noPermBox}>
              ⚠️ You don't have permission to place orders. Ask your Manager or Admin to check out.
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h2 style={styles.secTitle}>Order Summary</h2>
          {cartItems.map(ci => (
            <div key={ci.menuItem.id} style={styles.sumRow}>
              <span>{ci.menuItem.name} ×{ci.quantity}</span>
              <span>${(ci.menuItem.price * ci.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.sumDivider} />
          <div style={styles.sumTotal}>
            <span>Total</span>
            <span style={styles.totalAmt}>${totalAmount.toFixed(2)}</span>
          </div>

          {canPlaceOrder() && (
            <button style={{ ...styles.checkoutBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleCheckout} disabled={loading || !selectedPM}>
              {loading ? 'Placing Order...' : '✅ Place Order'}
            </button>
          )}
          <button style={styles.clearBtn} onClick={() => { clearCart(); toast.success('Cart cleared'); }}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: 800, color: '#1f2937' },
  sub: { color: '#6b7280', marginTop: '4px' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  items: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
  section: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  secTitle: { fontSize: '17px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' },
  item: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '12px 0', borderBottom: '1px solid #f3f4f6'
  },
  itemImg: { width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' },
  itemPrice: { fontSize: '12px', color: '#9ca3af' },
  qtyCtrl: { display: 'flex', alignItems: 'center', gap: '10px' },
  qBtn: {
    width: '28px', height: '28px', borderRadius: '8px', border: '1.5px solid #e5e7eb',
    background: '#f9fafb', cursor: 'pointer', fontSize: '16px', fontWeight: 700, color: '#374151'
  },
  qNum: { fontSize: '15px', fontWeight: 700, minWidth: '20px', textAlign: 'center' },
  subtotal: { fontSize: '15px', fontWeight: 700, minWidth: '60px', textAlign: 'right', color: '#1f2937' },
  removeBtn: {
    background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer',
    fontSize: '16px', padding: '4px'
  },
  noPM: { color: '#6b7280', fontSize: '14px', padding: '12px 0' },
  noPermBox: {
    background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '12px',
    padding: '16px', color: '#92400e', fontSize: '14px'
  },
  pmGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  pmCard: {
    border: '2px solid #e5e7eb', borderRadius: '12px', padding: '14px',
    cursor: 'pointer', transition: 'all 0.2s', background: '#f9fafb'
  },
  pmActive: { borderColor: '#ff6b35', background: '#fff5f1' },
  pmTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  pmType: { fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase' },
  pmDefault: {
    fontSize: '10px', background: '#22c55e', color: '#fff',
    padding: '2px 6px', borderRadius: '4px', fontWeight: 600
  },
  pmNumber: { fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '8px', letterSpacing: '1px' },
  pmBottom: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' },
  summary: {
    width: '300px', background: '#fff', borderRadius: '16px', padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: '84px'
  },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '8px' },
  sumDivider: { borderTop: '1px solid #f3f4f6', margin: '12px 0' },
  sumTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, marginBottom: '20px' },
  totalAmt: { color: '#ff6b35', fontSize: '20px' },
  checkoutBtn: {
    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ff6b35, #e55a24)',
    color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700,
    fontSize: '15px', cursor: 'pointer', marginBottom: '10px'
  },
  clearBtn: {
    width: '100%', padding: '10px', background: '#f9fafb', color: '#ef4444',
    border: '1px solid #fee2e2', borderRadius: '10px', cursor: 'pointer', fontSize: '14px'
  },
  empty: { textAlign: 'center', padding: '80px 24px' },
  emptyIcon: { fontSize: '64px', marginBottom: '20px' },
  emptyTitle: { fontSize: '24px', fontWeight: 700, marginBottom: '8px' },
  emptySub: { color: '#9ca3af', marginBottom: '24px' },
  browseBtn: {
    padding: '12px 28px', background: '#ff6b35', color: '#fff',
    border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer'
  },
};
