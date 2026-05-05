import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const AttendeeDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings/my-bookings');
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your bookings.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="container text-center" style={{ marginTop: '5rem' }}><h2>Loading Dashboard...</h2></div>;

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>My <span className="text-gradient">Bookings</span></h2>

      {error && <div className="error-msg">{error}</div>}

      {bookings.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>No bookings yet</h3>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>You haven't booked any events. Start exploring!</p>
          <Link to="/events" className="btn btn-primary">Browse Events</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {bookings.map((booking) => (
            <div key={booking._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                  <Link to={`/events/${booking.event._id}`} style={{ color: 'var(--text-main)' }}>
                    {booking.event.title}
                  </Link>
                </h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  📅 {new Date(booking.event.date).toLocaleDateString()} | 📍 {booking.event.venue}
                </div>
                <div>
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: '600' }}>{booking.ticketType} Ticket</span>
                  <span className="text-muted" style={{ margin: '0 0.5rem' }}>•</span>
                  <span>Qty: {booking.quantity}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', flex: '1 1 150px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Total: ৳{booking.totalPrice}</div>
                <div style={{ 
                  display: 'inline-block',
                  background: 'rgba(16, 185, 129, 0.2)', 
                  color: '#10b981', 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  PAID ({booking.paymentMethod})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeeDashboard;
