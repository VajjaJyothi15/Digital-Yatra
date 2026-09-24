import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/api';
import { UserPlus, Compass, UserCheck, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';
import DigitalYatraLogo from '../components/DigitalYatraLogo';

export default function Register({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [role, setRole] = useState('TOURIST'); // TOURIST, GUIDE, ADMIN
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Tourist fields
  const [budgetPreference, setBudgetPreference] = useState('Medium');
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Guide fields
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Goa');
  const [languages, setLanguages] = useState('English, Hindi');
  const [specialization, setSpecialization] = useState('Heritage & Culture');
  const [experience, setExperience] = useState('3 years');
  const [experienceYears, setExperienceYears] = useState(3);
  const [price, setPrice] = useState(800);

  // Admin field
  const [adminCode, setAdminCode] = useState('ADMIN2026');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const interestOptions = ['History', 'Food', 'Nature', 'Shopping', 'Adventure', 'Culture', 'Spiritual'];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === 'TOURIST' ? {
          interests: selectedInterests.join(', '),
          budget_preference: budgetPreference,
        } : role === 'GUIDE' ? {
          phone,
          city,
          languages,
          specialization,
          experience: `${experienceYears} Years`,
          experience_years: Number(experienceYears),
          price: Number(price)
        } : {
          admin_code: adminCode
        })
      };

      const res = await registerUser(payload);

      if (res.success) {
        onLoginSuccess(res.user);
        if (role === 'GUIDE') {
          navigate('/guide-dashboard');
        } else if (role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <DigitalYatraLogo size={44} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create Your Account</h2>
          <p className="text-slate-500 text-xs font-medium">
            Join Digital Yatra as a Tourist, Local Guide, or Platform Administrator
          </p>
        </div>

        {/* Role Selector Tabs (3 Roles) */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setRole('TOURIST')}
            className={`py-2.5 rounded-xl transition ${role === 'TOURIST' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🧳 Tourist
          </button>
          <button
            type="button"
            onClick={() => setRole('GUIDE')}
            className={`py-2.5 rounded-xl transition ${role === 'GUIDE' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🧑‍🏫 Local Guide
          </button>
          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`py-2.5 rounded-xl transition ${role === 'ADMIN' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium" 
              placeholder={role === 'ADMIN' ? "Admin Officer Name" : role === 'GUIDE' ? "Guide Full Name" : "Tourist Full Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium" 
              placeholder="e.g. user@digitalyatra.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password (min 6 chars)</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* TOURIST-SPECIFIC FIELDS */}
          {role === 'TOURIST' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Preference</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none font-medium" 
                  value={budgetPreference} 
                  onChange={(e) => setBudgetPreference(e.target.value)}
                >
                  <option value="Low">Budget (Economic)</option>
                  <option value="Medium">Standard / Comfort (Medium)</option>
                  <option value="High">Luxury / Premium (High)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Interests</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {interestOptions.map((opt) => {
                    const active = selectedInterests.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleInterest(opt)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          active ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {active ? '✓ ' : '+ '} {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* GUIDE-SPECIFIC FIELDS */}
          {role === 'GUIDE' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none font-medium" 
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / Destination</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none font-medium" 
                    placeholder="Goa, Jaipur, Tirupati..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guide Experience (Years)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="50"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none font-bold text-slate-900" 
                    placeholder="e.g. 5"
                    value={experienceYears}
                    onChange={(e) => {
                      const val = e.target.value;
                      setExperienceYears(val);
                      setExperience(`${val} Years`);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Fee Rate (₹/day)</label>
                  <input 
                    type="number" 
                    min="100"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none font-bold text-slate-900" 
                    placeholder="800"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Languages Spoken (Comma-separated)</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-indigo-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  placeholder="English, Hindi, Telugu, Spanish..."
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                />
                <p className="text-[10px] text-amber-700 font-bold mt-1">💡 Enter all languages you conduct tours in</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guide Specializations (Choose Multiple)</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Heritage & Culture',
                    'Religious Tourism',
                    'Food & Culinary',
                    'Nature & Wildlife',
                    'Photography',
                    'Adventure & Trekking',
                    'Shopping & Local Crafts'
                  ].map((specOpt) => {
                    const selectedList = typeof specialization === 'string' ? specialization.split(', ').filter(Boolean) : [];
                    const active = selectedList.includes(specOpt);
                    return (
                      <button
                        type="button"
                        key={specOpt}
                        onClick={() => {
                          let updated;
                          if (active) {
                            updated = selectedList.filter((s) => s !== specOpt);
                          } else {
                            updated = [...selectedList, specOpt];
                          }
                          setSpecialization(updated.join(', '));
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                          active 
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                        }`}
                      >
                        {active ? '✓ ' : '+ '} {specOpt}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Select all categories that apply to your tour expertise.</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                ℹ️ Note: Guide profiles will undergo Admin Verification before being listed in search.
              </div>
            </>
          )}

          {/* ADMIN-SPECIFIC FIELDS */}
          {role === 'ADMIN' && (
            <div className="space-y-3 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Administrator Security Credentials</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Security Passcode</label>
                <div className="relative">
                  <input 
                    type="password"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium" 
                    placeholder="ADMIN2026"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                🔑 Admin Registration grants full authority over Destination approval, Guide Verification & Incident Reports.
              </p>
            </div>
          )}

          <button 
            type="submit" 
            className={`w-full py-3.5 text-white font-extrabold text-sm rounded-xl shadow-lg transition disabled:opacity-50 ${
              role === 'GUIDE' ? 'bg-amber-500 hover:bg-amber-600' : role === 'ADMIN' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Registering...' : `REGISTER AS ${role}`}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
