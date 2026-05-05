import { useState, useEffect } from 'react';
import API from '../services/api';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create event state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', venue: '', location: '', price: '', description: '', date: '', category: ''
  });

  const fetchMyEvents = async () => {
    try {
      const res = await API.get('/events/organizer/my-events');
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load your events.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/events', formData);
      setFormData({ title: '', venue: '', location: '', price: '', description: '', date: '', category: '' });
      setShowForm(false);
      fetchMyEvents();
    } catch (err) {
      alert('Failed to create event');
    }
  };

  if (loading) return <div className="container text-center" style={{ marginTop: '5rem' }}><h2>Loading Dashboard...</h2></div>;

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My <span className="text-gradient">Dashboard</span></h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create New Event'}
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Create Event</h3>
          <form onSubmit={handleCreateEvent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group"><label className="form-label">Title</label><input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Category</label><input type="text" name="category" className="form-input" value={formData.category} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Venue</label><input type="text" name="venue" className="form-input" value={formData.venue} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Location</label><input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Date</label><input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Price (৳)</label><input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} required /></div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description</label>
              <textarea name="description" className="form-input" rows="3" value={formData.description} onChange={handleChange} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Submit Event</button>
          </form>
        </div>
      )}

      <h3>Your Events</h3>
      {events.length === 0 ? (
        <p className="text-muted" style={{ marginTop: '1rem' }}>You haven't created any events yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {events.map(event => (
            <div key={event._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{event.title}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.venue}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  background: event.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : event.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: event.status === 'approved' ? '#10b981' : event.status === 'rejected' ? '#ef4444' : '#f59e0b'
                }}>
                  {event.status.toUpperCase()}
                </span>
                <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>View Attendees</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
