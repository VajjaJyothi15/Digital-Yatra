import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, forgotPassword, resetPassword, loginWithGoogle } from '../api/api';
import { LogIn, Compass, UserCheck, ShieldCheck, Eye, EyeOff, Lock, Mail, CheckCircle, Key } from 'lucide-react';
import DigitalYatraLogo from '../components/DigitalYatraLogo';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('TOURIST'); // TOURIST, GUIDE, ADMIN
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotToken, setForgotToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email request, 2: Reset password
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        onLoginSuccess(res.user);
        
        // Redirect according to user role
        const userRole = res.user?.role || role;
        if (userRole === 'GUIDE') {
          navigate('/guide-dashboard');
        } else if (userRole === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setLoading(true);

    try {
      if (forgotStep === 1) {
        const res = await forgotPassword(forgotEmail);
        if (res.success) {
          setForgotToken(res.reset_token || 'RESET_TOKEN_123');
          setForgotSuccess(res.message || 'Verification token generated.');
          setForgotStep(2);
        } else {
          setForgotError(res.message || 'Failed to send reset email.');
        }
      } else {
        const res = await resetPassword({ email: forgotEmail, token: forgotToken, new_password: newPassword });
        if (res.success) {
          setForgotSuccess('✓ Password reset successfully! You can now log in.');
          setTimeout(() => {
            setShowForgotModal(false);
            setForgotStep(1);
            setEmail(forgotEmail);
            setPassword(newPassword);
          }, 2000);
        } else {
          setForgotError(res.message || 'Failed to reset password.');
        }
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Error processing request.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const demoGoogleEmail = `google.user.${Math.floor(Math.random() * 1000)}@gmail.com`;
      const res = await loginWithGoogle({
        email: demoGoogleEmail,
        name: 'Google Traveler',
        role: role
      });

      if (res.success) {
        onLoginSuccess(res.user);
        const userRole = res.user?.role || role;
        if (userRole === 'GUIDE') navigate('/guide-dashboard');
        else if (userRole === 'ADMIN') navigate('/admin');
        else navigate('/');
      } else {
        setError(res.message || 'Google Auth failed.');
      }
    } catch (err) {
      setError('Google Login connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative">
      
      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[2500] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" /> Reset Password
              </h3>
              <button 
                onClick={() => { setShowForgotModal(false); setForgotStep(1); }} 
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {forgotSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> {forgotSuccess}
              </div>
            )}

            {forgotError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200">
                ⚠️ {forgotError}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStep === 1 ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                      placeholder="e.g. tourist@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required 
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enter your registered email to receive verification token & password reset link.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Verification Token</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-slate-50 font-bold"
                      value={forgotToken}
                      onChange={(e) => setForgotToken(e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Secure Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" 
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required 
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition"
              >
                {loading ? 'Processing...' : (forgotStep === 1 ? 'Generate Reset Code' : 'Update & Save New Password')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN CARD */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <DigitalYatraLogo size={44} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back to Digital Yatra</h2>
          <p className="text-slate-500 text-xs font-medium">
            Sign in to access your travel plans, guide bookings & smart companion
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setRole('TOURIST')}
            className={`py-2 rounded-xl transition ${role === 'TOURIST' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🧳 Tourist
          </button>
          <button
            type="button"
            onClick={() => setRole('GUIDE')}
            className={`py-2 rounded-xl transition ${role === 'GUIDE' ? 'bg-white text-amber-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🧑‍🏫 Local Guide
          </button>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`py-2 rounded-xl transition ${role === 'ADMIN' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🔐 Admin
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200 font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-900" 
                placeholder="e.g. tourist@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <button 
                type="button"
                onClick={() => { setShowForgotModal(true); setForgotEmail(email); }}
                className="text-[11px] text-blue-600 hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            
            {/* Password Field with Working Eye Icon Toggle */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-900" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in...' : `SIGN IN AS ${role}`}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-xs font-bold">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Google OAuth Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
