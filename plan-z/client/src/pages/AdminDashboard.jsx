import { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, usersRes, complaintsRes] = await Promise.all([
        API.get('/events/admin/all'),
        API.get('/users'),
        API.get('/complaints')
      ]);
      setEvents(eventsRes.data);
      setUsers(usersRes.data);
      setComplaints(complaintsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateEventStatus = async (eventId, newStatus) => {
    try {
      await API.put(`/events/admin/${eventId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update event status');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      fetchData();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/users/${userId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleResolveComplaint = async (complaintId) => {
    const responseText = window.prompt("Enter resolution response:");
    if (!responseText) return;

    try {
      await API.put(`/complaints/${complaintId}/respond`, { response: responseText });
      fetchData();
    } catch (err) {
      alert('Failed to resolve complaint');
    }
  };

  if (loading) return <div className="container text-center" style={{ marginTop: '5rem' }}><h2>Loading Admin Panel...</h2></div>;

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Admin <span className="text-gradient">Control Panel</span></h2>

      {error && <div className="error-msg">{error}</div>}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('events')}>Events</button>
        <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`btn ${activeTab === 'complaints' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('complaints')}>Complaints</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {activeTab === 'events' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Event Approvals</h3>
            {events.length === 0 ? (
              <p className="text-muted">No events in the system.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.map((event) => (
                  <div key={event._id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{event.title}</h4>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>By: {event.organizer?.name}</div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: event.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : event.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: event.status === 'approved' ? '#10b981' : event.status === 'rejected' ? '#ef4444' : '#f59e0b' }}>
                        {event.status.toUpperCase()}
                      </span>
                      
                      {event.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleUpdateEventStatus(event._id, 'approved')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => handleUpdateEventStatus(event._id, 'rejected')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>User Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {users.map((u) => (
                <div key={u._id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem' }}>{u.name}</h4>
                    <div className="text-muted" style={{ fontSize: '0.9rem' }}>{u.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select value={u.role} onChange={(e) => handleUpdateUserRole(u._id, e.target.value)} className="form-select" style={{ padding: '0.5rem', width: 'auto' }}>
                      <option value="attendee">Attendee</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem' }}>Complaints</h3>
            {complaints.length === 0 ? <p className="text-muted">No complaints filed.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {complaints.map(c => (
                  <div key={c._id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.1rem' }}>{c.subject} <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: '1rem' }}>From: {c.user?.name}</span></h4>
                      <span style={{ color: c.status === 'Resolved' ? '#10b981' : '#f59e0b', fontWeight: '600' }}>{c.status}</span>
                    </div>
                    <p className="text-muted" style={{ marginBottom: '1rem' }}>{c.description}</p>
                    {c.status === 'Open' ? (
                      <button onClick={() => handleResolveComplaint(c._id)} className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Respond & Resolve</button>
                    ) : (
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                        <strong>Response:</strong> {c.response}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;