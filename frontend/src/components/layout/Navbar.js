import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ROLE_COLORS = { ADMIN: '#ff6b35', MANAGER: '#8b5cf6', MEMBER: '#22c55e' };

export default function Navbar() {
  const { user, logout, canManagePayment } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { to: '/restaurants', label: '🏪 Restaurants' },
    { to: '/orders', label: '📋 My Orders' },
    ...(canManagePayment() ? [{ to: '/payment', label: '💳 Payment' }] : []),
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/restaurants" style={styles.brand}>
          <span style={styles.logo}>🍔</span>
          <span style={styles.brandText}>Slooze</span>
        </Link>

        <div style={styles.links}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              style={{ ...styles.link, ...(isActive(link.to) ? styles.linkActive : {}) }}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={styles.right}>
          <Link to="/cart" style={styles.cartBtn}>
            🛒
            {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
          </Link>

          <div style={styles.userMenu} onClick={() => setMenuOpen(!menuOpen)}>
            <div style={styles.avatar}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{user?.fullName}</span>
              <span style={{ ...styles.roleTag, background: ROLE_COLORS[user?.role] }}>
                {user?.role}
                {user?.country ? ` · ${user.country}` : ' · GLOBAL'}
              </span>
            </div>
            <span style={styles.chevron}>▾</span>

            {menuOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <div style={styles.dropdownName}>{user?.fullName}</div>
                  <div style={styles.dropdownUsername}>@{user?.username}</div>
                </div>
                <hr style={styles.divider} />
                <button style={styles.dropdownItem} onClick={handleLogout}>
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky',
    top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  inner: {
    maxWidth: '1280px', margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', height: '64px', gap: '32px'
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logo: { fontSize: '28px' },
  brandText: { fontSize: '22px', fontWeight: 800, color: '#ff6b35' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: {
    padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
    color: '#6b7280', textDecoration: 'none', transition: 'all 0.2s'
  },
  linkActive: { background: '#fff5f1', color: '#ff6b35', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  cartBtn: {
    position: 'relative', fontSize: '22px', textDecoration: 'none',
    padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center'
  },
  badge: {
    position: 'absolute', top: '-4px', right: '-4px', background: '#ff6b35',
    color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '50%',
    width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  userMenu: {
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
    position: 'relative', padding: '6px 10px', borderRadius: '10px',
    border: '1px solid #e5e7eb', background: '#f9fafb'
  },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%', background: '#ff6b35',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '14px'
  },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontSize: '13px', fontWeight: 600, color: '#1f2937' },
  roleTag: {
    fontSize: '10px', fontWeight: 600, color: '#fff', padding: '1px 6px',
    borderRadius: '4px', marginTop: '2px'
  },
  chevron: { color: '#9ca3af', fontSize: '12px' },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff',
    border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)', minWidth: '200px', zIndex: 200
  },
  dropdownHeader: { padding: '8px 12px 12px' },
  dropdownName: { fontSize: '14px', fontWeight: 600, color: '#1f2937' },
  dropdownUsername: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  divider: { border: 'none', borderTop: '1px solid #f3f4f6', margin: '4px 0' },
  dropdownItem: {
    width: '100%', padding: '10px 12px', border: 'none', background: 'none',
    textAlign: 'left', fontSize: '14px', color: '#ef4444', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 500
  },
};
