import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Users, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      setUsers(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Customer Accounts Directory</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>View registered customers and assigned security roles.</p>
        </div>
        <button onClick={loadUsers} className="btn btn-secondary btn-sm">Refresh Users</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Assigned Roles</th>
              <th>Account Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30 }}>Loading accounts...</td></tr>
            ) : users.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.firstName} {u.lastName}</strong>
                </td>
                <td>
                  <div className="flex items-center gap-1" style={{ color: '#475569' }}>
                    <Mail size={13} color="#94a3b8" />
                    <span>{u.email}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1" style={{ color: '#475569' }}>
                    <Phone size={13} color="#94a3b8" />
                    <span>{u.phone || 'Not provided'}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {u.roles?.map((r) => (
                      <span
                        key={r}
                        className={`badge ${r === 'ROLE_ADMIN' ? 'badge-primary' : 'badge-gray'}`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: '#64748b' }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
