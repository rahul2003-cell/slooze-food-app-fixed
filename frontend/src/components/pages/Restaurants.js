import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    getRestaurants()
      .then(res => setRestaurants(res.data.data || []))
      .catch(() => toast.error('Failed to load restaurants'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, r) => {
    acc[r.country] = acc[r.country] || [];
    acc[r.country].push(r);
    return acc;
  }, {});

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          {user?.country ? `🍽️ ${user.country} Restaurants` : '🍽️ All Restaurants'}
        </h1>
        <p style={styles.heroSub}>
          {user?.country
            ? `Showing restaurants available in ${user.country}`
            : 'You have access to all restaurants globally'}
        </p>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input style={styles.search} placeholder="Search restaurants or cuisines..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loading}>Loading restaurants...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>No restaurants found</div>
        ) : (
          Object.entries(grouped).map(([country, list]) => (
            <div key={country} style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.flag}>{country === 'INDIA' ? '🇮🇳' : '🇺🇸'}</span>
                <h2 style={styles.sectionTitle}>{country === 'INDIA' ? 'India' : 'America'}</h2>
                <span style={styles.count}>{list.length} restaurants</span>
              </div>
              <div style={styles.grid}>
                {list.map(r => (
                  <Link to={`/restaurants/${r.id}`} key={r.id} style={styles.card}>
                    <div style={styles.imgWrap}>
                      <img src={r.imageUrl} alt={r.name} style={styles.img}
                        onError={e => e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant'} />
                      <div style={styles.cuisine}>{r.cuisine}</div>
                    </div>
                    <div style={styles.cardBody}>
                      <h3 style={styles.name}>{r.name}</h3>
                      <p style={styles.address}>📍 {r.address}</p>
                      <div style={styles.footer}>
                        <span style={styles.rating}>⭐ {r.rating}</span>
                        <span style={styles.viewMenu}>View Menu →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: 'calc(100vh - 64px)', background: '#f8f9fa' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    padding: '48px 24px 56px', textAlign: 'center'
  },
  heroTitle: { fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '10px' },
  heroSub: { color: '#94a3b8', fontSize: '16px', marginBottom: '28px' },
  searchWrap: {
    maxWidth: '480px', margin: '0 auto', position: 'relative',
    display: 'flex', alignItems: 'center'
  },
  searchIcon: { position: 'absolute', left: '16px', fontSize: '18px', zIndex: 1 },
  search: {
    width: '100%', padding: '14px 16px 14px 46px', borderRadius: '12px',
    border: 'none', fontSize: '15px', outline: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  content: { maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' },
  loading: { textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '18px' },
  empty: { textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '18px' },
  section: { marginBottom: '48px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  flag: { fontSize: '28px' },
  sectionTitle: { fontSize: '22px', fontWeight: 700, color: '#1f2937' },
  count: {
    background: '#f3f4f6', color: '#6b7280', padding: '3px 10px',
    borderRadius: '20px', fontSize: '13px', fontWeight: 500
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'
  },
  card: {
    background: '#fff', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'block'
  },
  imgWrap: { position: 'relative', height: '180px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  cuisine: {
    position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.65)',
    color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500
  },
  cardBody: { padding: '16px' },
  name: { fontSize: '17px', fontWeight: 700, color: '#1f2937', marginBottom: '6px' },
  address: { fontSize: '13px', color: '#6b7280', marginBottom: '12px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rating: { fontSize: '14px', fontWeight: 600, color: '#1f2937' },
  viewMenu: { fontSize: '13px', color: '#ff6b35', fontWeight: 600 },
};
