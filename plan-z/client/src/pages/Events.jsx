import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get('/events');
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="container text-center" style={{ marginTop: '5rem' }}><h2>Loading events...</h2></div>;
  }

  if (error) {
    return <div className="container text-center" style={{ marginTop: '5rem' }}><div className="error-msg">{error}</div></div>;
  }

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>
        Upcoming <span className="text-gradient">Events</span>
      </h2>

      {events.length === 0 ? (
        <p className="text-muted">No upcoming events found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {events.map((event) => (
            <div key={event._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ 
                  background: 'rgba(99, 102, 241, 0.2)', 
                  color: 'var(--accent-primary)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {event.category || 'General'}
                </span>
              </div>
              
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>{event.title}</h3>
              <p className="text-muted" style={{ marginBottom: '1rem', flex: 1 }}>
                {event.description?.substring(0, 100)}...
              </p>
              
              <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.3rem' }}>📅 {new Date(event.date).toLocaleDateString()}</div>
                <div style={{ marginBottom: '0.3rem' }}>📍 {event.location} - {event.venue}</div>
                <div style={{ fontWeight: '600', color: 'var(--accent-secondary)' }}>🎟️ ৳{event.price}</div>
              </div>

              <Link to={`/events/${event._id}`} className="btn btn-outline" style={{ textAlign: 'center' }}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;