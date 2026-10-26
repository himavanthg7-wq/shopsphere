import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { addressApi } from '../../api/addressApi';
import { User, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'HOME',
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await addressApi.getAddresses();
      setAddresses(res || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addressApi.createAddress(form);
      setShowForm(false);
      setForm({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        addressType: 'HOME',
        isDefault: false,
      });
      loadAddresses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await addressApi.deleteAddress(id);
      loadAddresses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '36px 20px', maxWidth: 860 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>
        Account Settings
      </h1>

      {/* User Info Card */}
      <div className="card" style={{ padding: 24, marginBottom: 28 }}>
        <div className="flex items-center gap-4">
          <div style={{ width: 60, height: 60, borderRadius: 9999, backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={30} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user?.firstName} {user?.lastName}</h2>
            <div style={{ fontSize: 14, color: '#64748b' }}>{user?.email}</div>
            <div style={{ marginTop: 6 }}>
              <span className="badge badge-primary">{user?.roles?.[0] || 'CUSTOMER'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="card" style={{ padding: 24 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-2">
            <MapPin size={20} color="#2563eb" />
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Saved Shipping Addresses</h3>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-secondary btn-sm">
            <Plus size={14} />
            <span>{showForm ? 'Cancel' : 'Add Address'}</span>
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddAddress} style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 10, marginBottom: 24 }}>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Street</label>
              <input
                type="text"
                required
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  required
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {addresses.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between"
              style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8 }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong style={{ fontSize: 15 }}>{a.fullName}</strong>
                  <span className="badge badge-gray" style={{ fontSize: 11 }}>{a.addressType}</span>
                  {a.isDefault && <span className="badge badge-primary">Default</span>}
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                  {a.street}, {a.city}, {a.state} - {a.postalCode}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Phone: {a.phone}</div>
              </div>

              <button
                onClick={() => handleDeleteAddress(a.id)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
