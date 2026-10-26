import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../../api/authApi';
import { loginSuccess } from '../../store/authSlice';
import { ShoppingBag, Lock, Mail, ShieldAlert, UserCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await authApi.login({ email, password });
      dispatch(loginSuccess(res));

      if (res.roles?.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillCustomerDemo = () => {
    setEmail('customer@shopsphere.com');
    setPassword('Customer@123');
    setError(null);
  };

  const fillAdminDemo = () => {
    setEmail('admin@shopsphere.com');
    setPassword('Admin@123');
    setError(null);
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 460 }}>
      <div className="card" style={{ padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: '#2563eb',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <ShoppingBag size={28} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Welcome Back</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to manage your orders & cart</p>
        </div>

        {/* 1-Click Demo Fill Helpers */}
        <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8, textAlign: 'center' }}>
            ⚡ 1-CLICK DEMO CREDENTIALS
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillCustomerDemo}
              className="btn btn-secondary btn-sm flex-1"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <UserCheck size={14} color="#2563eb" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="btn btn-secondary btn-sm flex-1"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <KeyRound size={14} color="#a855f7" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              fontSize: 13,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: 38 }}
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: 16 }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}
