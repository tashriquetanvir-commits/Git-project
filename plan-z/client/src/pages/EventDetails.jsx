import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking state
  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState('General');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        setError('Event not found or failed to load.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookTicket = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await API.post('/bookings', {
        eventId: id,
        quantity,
        ticketType
      });
      
      setBookingSuccess('Ticket booked successfully! You can view it in your dashboard.');
      setQuantity(1);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book ticket.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="container text-center" style={{ marginTop: '5rem' }}><h2>Loading event details...</h2></div>;
  if (error) return <div className="container text-center" style={{ marginTop: '5rem' }}><div className="error-msg">{error}</div></div>;
  if (!event) return null;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
      <Link to="/events" className="text-muted" style={{ display: 'inline-block', marginBottom: '2rem' }}>
        &larr; Back to Events
      </Link>

      <div className="glass-panel" style={{ padding: '3rem', position: 'relative' }}>
        <span style={{ 
            background: 'rgba(99, 102, 241, 0.2)', 
            color: 'var(--accent-primary)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            position: 'absolute',
            top: '3rem',
            right: '3rem'
        }}>
            {event.category || 'General'}
        </span>

        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', paddingRight: '100px' }}>{event.title}</h1>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          <div>📅 {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>📍 {event.venue}, {event.location}</div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'white' }}>About this event</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{event.description}</p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Book Tickets</span>
            <span style={{ color: 'var(--accent-secondary)' }}>৳{event.price} / ticket</span>
          </h3>

          {bookingSuccess && <div style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{bookingSuccess}</div>}
          {bookingError && <div className="error-msg">{bookingError}</div>}

          {!user ? (
            <div className="text-center" style={{ padding: '2rem 0' }}>
              <p style={{ marginBottom: '1rem' }}>You need to be logged in to book tickets.</p>
              <Link to="/login" className="btn btn-primary">Log in to Book</Link>
            </div>
          ) : user.role !== 'attendee' ? (
            <div className="text-center" style={{ padding: '2rem 0' }}>
              <p className="text-muted">Only attendees can book tickets.</p>
            </div>
          ) : (
            <form onSubmit={handleBookTicket} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label className="form-label">Ticket Type</label>
                <select className="form-select" value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
                  <option value="General">General Admission</option>
                  <option value="VIP">VIP Pass</option>
                  <option value="Early Bird">Early Bird</option>
                </select>
              </div>
              
              <div style={{ width: '120px' }}>
                <label className="form-label">Quantity</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="1" 
                  max="10" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))} 
                />
              </div>

              <div style={{ paddingBottom: '0.5rem', fontWeight: '600', fontSize: '1.2rem', minWidth: '100px' }}>
                Total: ৳{event.price * quantity}
              </div>

              <button type="submit" className="btn btn-primary" disabled={bookingLoading} style={{ flex: '1 1 200px' }}>
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
