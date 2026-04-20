import React, { useEffect, useState } from 'react';
import { getMyOrders, cancelOrder as cancelOrderApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  CART: { bg: '#fef9c3', color: '#854d0e', label: '🛒 In Cart' },
  PLACED: { bg: '#dcfce7', color: '#166534', label: '✅ Placed' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b', label: '❌ Cancelled' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { canCancelOrder } = useAuth();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = () => {
    getMyOrders()
      .then(res => setOrders((res.data.data || []).sort((a, b) => b.id - a.id)))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await cancelOrderApi(orderId);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <div style={styles.loading}>Loading orders...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📋 My Orders</h1>
      <p style={styles.sub}>{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>📭</div>
          <h2>No orders yet</h2>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>Start browsing restaurants to place your first order</p>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(order => {
            const st = STATUS_STYLES[order.status] || STATUS_STYLES.CART;
            return (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.orderId}>Order #{order.id}</div>
                    <div style={styles.restaurantName}>
                      🏪 {order.restaurant?.name || 'Restaurant'}
                    </div>
                    <div style={styles.date}>
                      {order.placedAt
                        ? `Placed: ${new Date(order.placedAt).toLocaleString()}`
                        : order.cancelledAt
                          ? `Cancelled: ${new Date(order.cancelledAt).toLocaleString()}`
                          : `Created: ${new Date(order.createdAt).toLocaleString()}`}
                    </div>
                  </div>
                  <div style={styles.right}>
                    <span style={{ ...styles.statusBadge, background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    <div style={styles.total}>${order.totalAmount?.toFixed(2)}</div>
                  </div>
                </div>

                <div style={styles.items}>
                  {(order.items || []).map(item => (
                    <div key={item.id} style={styles.item}>
                      <span style={styles.itemName}>{item.menuItem?.name}</span>
                      <span style={styles.itemQty}>×{item.quantity}</span>
                      <span style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.paymentMethod && (
                  <div style={styles.pm}>
                    💳 {order.paymentMethod.cardType} •••• {order.paymentMethod.cardLastFour}
                  </div>
                )}

                {canCancelOrder() && order.status === 'PLACED' && (
                  <button style={styles.cancelBtn} onClick={() => handleCancel(order.id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '28px', fontWeight: 800, color: '#1f2937', marginBottom: '4px' },
  sub: { color: '#9ca3af', marginBottom: '28px', fontSize: '15px' },
  loading: { textAlign: 'center', padding: '80px', color: '#9ca3af', fontSize: '18px' },
  empty: { textAlign: 'center', padding: '60px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
  orderId: { fontSize: '16px', fontWeight: 700, color: '#1f2937', marginBottom: '4px' },
  restaurantName: { fontSize: '14px', color: '#6b7280', marginBottom: '4px' },
  date: { fontSize: '12px', color: '#9ca3af' },
  right: { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  total: { fontSize: '20px', fontWeight: 800, color: '#1f2937' },
  items: { borderTop: '1px solid #f3f4f6', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' },
  item: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' },
  itemName: { flex: 1, color: '#374151', fontWeight: 500 },
  itemQty: { color: '#9ca3af' },
  itemPrice: { fontWeight: 600, color: '#1f2937' },
  pm: { marginTop: '12px', fontSize: '13px', color: '#9ca3af', borderTop: '1px solid #f3f4f6', paddingTop: '10px' },
  cancelBtn: {
    marginTop: '14px', padding: '8px 18px', background: '#fff', border: '1.5px solid #ef4444',
    color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600
  },
};
