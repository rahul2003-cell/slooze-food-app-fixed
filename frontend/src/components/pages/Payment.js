import React, { useEffect, useState } from 'react';
import { getPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EMPTY_FORM = { cardHolderName: '', cardLastFour: '', cardType: 'VISA', expiryMonth: '', expiryYear: '', isDefault: false };

export default function Payment() {
  const { canManagePayment } = useAuth();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMethods(); }, []);

  const fetchMethods = () => {
    getPaymentMethods()
      .then(res => setMethods(res.data.data || []))
      .catch(() => toast.error('Failed to load payment methods'))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async () => {
    if (!form.cardHolderName || !form.cardLastFour || !form.expiryMonth || !form.expiryYear) {
      toast.error('Please fill all fields'); return;
    }
    if (form.cardLastFour.length !== 4 || !/^\d+$/.test(form.cardLastFour)) {
      toast.error('Card last 4 must be exactly 4 digits'); return;
    }
    setSaving(true);
    try {
      if (editId) {
        await updatePaymentMethod(editId, form);
        toast.success('Payment method updated');
      } else {
        await addPaymentMethod(form);
        toast.success('Payment method added');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY_FORM);
      fetchMethods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleEdit = (pm) => {
    setForm({ cardHolderName: pm.cardHolderName, cardLastFour: pm.cardLastFour,
      cardType: pm.cardType, expiryMonth: pm.expiryMonth, expiryYear: pm.expiryYear, isDefault: pm.isDefault });
    setEditId(pm.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment method?')) return;
    try {
      await deletePaymentMethod(id);
      toast.success('Payment method deleted');
      fetchMethods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (!canManagePayment()) {
    return (
      <div style={styles.denied}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ marginBottom: '8px' }}>Access Denied</h2>
        <p style={{ color: '#9ca3af' }}>Only Admins can manage payment methods.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>💳 Payment Methods</h1>
          <p style={styles.sub}>Manage organization payment methods</p>
        </div>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditId(null); setForm(EMPTY_FORM); }}>
          + Add New Card
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3 style={styles.formTitle}>{editId ? 'Edit' : 'Add'} Payment Method</h3>
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Card Holder Name</label>
              <input style={styles.input} value={form.cardHolderName}
                onChange={e => setForm({ ...form, cardHolderName: e.target.value })} placeholder="John Doe" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Card Type</label>
              <select style={styles.input} value={form.cardType}
                onChange={e => setForm({ ...form, cardType: e.target.value })}>
                <option>VISA</option><option>MASTERCARD</option><option>AMEX</option><option>DISCOVER</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last 4 Digits</label>
              <input style={styles.input} value={form.cardLastFour} maxLength={4}
                onChange={e => setForm({ ...form, cardLastFour: e.target.value })} placeholder="4242" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Expiry Month</label>
              <input style={styles.input} value={form.expiryMonth} maxLength={2}
                onChange={e => setForm({ ...form, expiryMonth: e.target.value })} placeholder="12" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Expiry Year</label>
              <input style={styles.input} value={form.expiryYear} maxLength={4}
                onChange={e => setForm({ ...form, expiryYear: e.target.value })} placeholder="2027" />
            </div>
            <div style={{ ...styles.field, justifyContent: 'flex-end' }}>
              <label style={styles.checkboxRow}>
                <input type="checkbox" checked={form.isDefault}
                  onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
                <span style={styles.label}>Set as Default</span>
              </label>
            </div>
          </div>
          <div style={styles.formActions}>
            <button style={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Card' : 'Add Card'}
            </button>
            <button style={styles.cancelBtn}
              onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Loading payment methods...</div>
      ) : methods.length === 0 ? (
        <div style={styles.empty}>No payment methods. Add one above.</div>
      ) : (
        <div style={styles.cardsGrid}>
          {methods.map(pm => (
            <div key={pm.id} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.cardType}>{pm.cardType}</span>
                {pm.isDefault && <span style={styles.defaultTag}>✓ Default</span>}
              </div>
              <div style={styles.cardNumber}>•••• •••• •••• {pm.cardLastFour}</div>
              <div style={styles.cardBottom}>
                <div>
                  <div style={styles.cardLabel}>CARD HOLDER</div>
                  <div style={styles.cardValue}>{pm.cardHolderName}</div>
                </div>
                <div>
                  <div style={styles.cardLabel}>EXPIRES</div>
                  <div style={styles.cardValue}>{pm.expiryMonth}/{pm.expiryYear}</div>
                </div>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.editBtn} onClick={() => handleEdit(pm)}>✏️ Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(pm.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '960px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: 800, color: '#1f2937', marginBottom: '4px' },
  sub: { color: '#9ca3af', fontSize: '15px' },
  addBtn: {
    padding: '10px 20px', background: '#ff6b35', color: '#fff', border: 'none',
    borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
  },
  denied: { textAlign: 'center', padding: '80px' },
  loading: { textAlign: 'center', padding: '40px', color: '#9ca3af' },
  empty: { textAlign: 'center', padding: '40px', color: '#9ca3af' },
  form: { background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: 700, marginBottom: '18px', color: '#1f2937' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
  input: { padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: 'auto', paddingBottom: '4px' },
  formActions: { display: 'flex', gap: '10px' },
  saveBtn: {
    padding: '10px 24px', background: '#ff6b35', color: '#fff', border: 'none',
    borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
  },
  cancelBtn: {
    padding: '10px 24px', background: '#f9fafb', color: '#6b7280',
    border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
  },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '16px', padding: '22px', color: '#fff'
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' },
  cardType: { fontSize: '14px', fontWeight: 700, letterSpacing: '1px' },
  defaultTag: { background: '#22c55e', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 },
  cardNumber: { fontSize: '20px', letterSpacing: '3px', marginBottom: '20px', fontWeight: 600 },
  cardBottom: { display: 'flex', gap: '32px', marginBottom: '20px' },
  cardLabel: { fontSize: '9px', color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' },
  cardValue: { fontSize: '13px', fontWeight: 600 },
  cardActions: { display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  editBtn: {
    flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500
  },
  deleteBtn: {
    flex: 1, padding: '8px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500
  },
};
