import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../services/api';
import toast from 'react-hot-toast';

const DEMO_USERS = [
  { label: 'Nick Fury (Admin)', username: 'nickfury', password: 'admin123', role: 'ADMIN', color: '#ff6b35' },
  { label: 'Captain Marvel (Manager-India)', username: 'captainmarvel', password: 'manager123', role: 'MANAGER', color: '#8b5cf6' },
  { label: 'Captain America (Manager-America)', username: 'captainamerica', password: 'manager123', role: 'MANAGER', color: '#3b82f6' },
  { label: 'Thanos (Member-India)', username: 'thanos', password: 'member123', role: 'MEMBER', color: '#6b21a8' },
  { label: 'Thor (Member-India)', username: 'thor', password: 'member123', role: 'MEMBER', color: '#0ea5e9' },
  { label: 'Travis (Member-America)', username: 'travis', password: 'member123', role: 'MEMBER', color: '#22c55e' },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(username, password);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      toast.success(`Welcome, ${userData.fullName}!`);
      navigate('/restaurants');
    } catch (err) {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (u) => {
    setUsername(u.username);
    setPassword(u.password);
    setLoading(true);
    try {
      const res = await loginApi(u.username, u.password);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      toast.success(`Welcome, ${userData.fullName}!`);
      navigate('/restaurants');
    } catch (err) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>🍔</div>
          <h1 style={styles.brandName}>Slooze</h1>
          <p style={styles.brandTag}>Food Ordering for Teams</p>
        </div>
        <div style={styles.features}>
          {['🏪 Browse restaurants by region', '🛒 Create & manage orders', '💳 Secure checkout', '👥 Role-based access control'].map(f => (
            <div key={f} style={styles.feature}>{f}</div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign In</h2>
          <p style={styles.subtitle}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.input} value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter username" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading} type="submit">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.divider}><span>Quick Login</span></div>

          <div style={styles.quickGrid}>
            {DEMO_USERS.map(u => (
              <button key={u.username} style={{ ...styles.quickBtn, borderColor: u.color }}
                onClick={() => quickLogin(u)} disabled={loading}>
                <span style={{ ...styles.roleDot, background: u.color }} />
                <div>
                  <div style={styles.quickName}>{u.label.split('(')[0].trim()}</div>
                  <div style={styles.quickRole}>{u.label.match(/\(([^)]+)\)/)?.[1]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px',
    color: '#fff'
  },
  brand: { marginBottom: '48px' },
  logo: { fontSize: '56px', marginBottom: '16px' },
  brandName: { fontSize: '42px', fontWeight: 800, color: '#ff6b35', marginBottom: '8px' },
  brandTag: { fontSize: '18px', color: '#94a3b8', fontWeight: 400 },
  features: { display: 'flex', flexDirection: 'column', gap: '16px' },
  feature: {
    background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px 20px',
    fontSize: '15px', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)'
  },
  right: {
    width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px', background: '#f8f9fa'
  },
  card: {
    width: '100%', background: '#fff', borderRadius: '20px', padding: '40px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
  },
  title: { fontSize: '28px', fontWeight: 700, marginBottom: '6px', color: '#1a1a2e' },
  subtitle: { color: '#6b7280', marginBottom: '28px', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
  input: {
    padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '10px',
    fontSize: '15px', outline: 'none', transition: 'border-color 0.2s',
  },
  btn: {
    padding: '14px', background: 'linear-gradient(135deg, #ff6b35, #e55a24)', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600,
    cursor: 'pointer', marginTop: '4px'
  },
  divider: {
    textAlign: 'center', position: 'relative', margin: '20px 0',
    color: '#9ca3af', fontSize: '13px',
    '::before': { content: '""' }
  },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  quickBtn: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
    background: '#f9fafb', border: '1.5px solid', borderRadius: '10px',
    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
  },
  roleDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  quickName: { fontSize: '12px', fontWeight: 600, color: '#1f2937' },
  quickRole: { fontSize: '11px', color: '#6b7280', marginTop: '2px' },
};
