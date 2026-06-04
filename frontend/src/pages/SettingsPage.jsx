import React, { useState } from 'react';
import { User, BarChart2, AlertTriangle, Download, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';
import * as api from '../utils/api'; // Assuming this has updateMe or we mock it

export default function SettingsPage() {
  const { user, login } = useAuth(); // login or update user function in context
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  // Mock stats
  const stats = {
    totalLinks: 42,
    totalClicks: 12480,
    memberSince: user?.createdAt ? new Date(user.createdAt) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    lastActive: new Date()
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    setLoading(true);
    try {
      const data = await api.updateProfile({ name });
      const updatedUser = { ...user, name: data.user?.name || name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    toast('Account deletion coming soon. Contact support.', { icon: '🔒' });
  };

  return (
    <AppLayout>
      <div className="pt-8 px-5 lg:px-10 max-w-[800px] mx-auto w-full pb-10">
        
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="font-display text-[36px] font-black text-ink m-0">Settings</h1>
          <p className="font-sans text-[14px] text-muted mt-1 m-0">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* CARD 1 - PROFILE */}
          <div className="bg-white border-[1.5px] border-border rounded-[20px] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(232,85,62,0.12)] flex items-center justify-center text-coral">
                  <User size={20} />
                </div>
                <h2 className="font-display text-[20px] font-bold text-ink m-0">Profile Information</h2>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white border border-border hover:bg-surface text-ink font-sans text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="p-8">
              {!isEditing ? (
                // VIEW MODE
                <div className="flex items-center gap-6">
                  <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-coral to-amber flex items-center justify-center text-white font-display text-[28px] font-bold shrink-0 shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-[18px] font-bold text-ink truncate">{user?.name || 'User Name'}</div>
                    <div className="font-sans text-[14px] text-muted mt-1 truncate">{user?.email || 'user@example.com'}</div>
                    <div className="font-sans text-[13px] text-muted mt-3 inline-block bg-surface px-3 py-1 rounded-full border border-border">
                      Member since {format(stats.memberSince, 'MMM yyyy')}
                    </div>
                  </div>
                </div>
              ) : (
                // EDIT MODE
                <div className="animate-fade-in">
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-coral to-amber flex items-center justify-center text-white font-display text-[28px] font-bold shadow-md">
                        {name.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <label className="block font-sans text-[12px] font-bold text-ink-light tracking-[0.8px] uppercase mb-2">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white border-[1.5px] border-border rounded-[10px] px-4 py-[10px] font-sans text-[14px] text-ink outline-none transition-all focus:border-coral focus:shadow-[0_0_0_4px_rgba(232,85,62,0.1)]"
                        />
                      </div>
                      
                      <div>
                        <label className="block font-sans text-[12px] font-bold text-ink-light tracking-[0.8px] uppercase mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <input 
                            type="email" 
                            value={user?.email || 'user@example.com'}
                            readOnly
                            className="w-full bg-surface border-[1.5px] border-border rounded-[10px] px-4 py-[10px] font-sans text-[14px] text-muted outline-none cursor-not-allowed"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[11px] text-muted-light bg-surface px-1">
                            Cannot be changed
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                        <button 
                          onClick={() => { setIsEditing(false); setName(user?.name || ''); }}
                          disabled={loading}
                          className="bg-white border border-border hover:bg-surface text-ink font-sans text-[14px] font-semibold px-5 py-2.5 rounded-[10px] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-coral hover:bg-coral-dark text-white border-none font-sans text-[14px] font-bold px-5 py-2.5 rounded-[10px] transition-colors cursor-pointer disabled:opacity-50 shadow-[0_4px_14px_rgba(232,85,62,0.25)]"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2 - ACCOUNT STATS */}
          <div className="bg-white border-[1.5px] border-border rounded-[20px] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-3 bg-surface/50">
              <div className="w-10 h-10 rounded-xl bg-[rgba(107,143,110,0.12)] flex items-center justify-center text-sage">
                <BarChart2 size={20} />
              </div>
              <h2 className="font-display text-[20px] font-bold text-ink m-0">Account Overview</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl p-5 border border-border">
                <div className="font-sans text-[12px] text-muted mb-1 font-semibold uppercase tracking-wide">Total Links Created</div>
                <div className="font-sans text-[24px] font-bold text-ink">{stats.totalLinks}</div>
              </div>
              <div className="bg-surface rounded-xl p-5 border border-border">
                <div className="font-sans text-[12px] text-muted mb-1 font-semibold uppercase tracking-wide">Total Clicks Generated</div>
                <div className="font-sans text-[24px] font-bold text-ink">{stats.totalClicks.toLocaleString()}</div>
              </div>
              <div className="bg-surface rounded-xl p-5 border border-border">
                <div className="font-sans text-[12px] text-muted mb-1 font-semibold uppercase tracking-wide">Member Since</div>
                <div className="font-sans text-[20px] font-bold text-ink">{format(stats.memberSince, 'MMM d, yyyy')}</div>
              </div>
              <div className="bg-surface rounded-xl p-5 border border-border">
                <div className="font-sans text-[12px] text-muted mb-1 font-semibold uppercase tracking-wide">Last Active</div>
                <div className="font-sans text-[20px] font-bold text-ink">Today</div>
              </div>
            </div>
          </div>

          {/* CARD 3 - DANGER ZONE */}
          <div className="bg-white border-[1.5px] border-[rgba(220,38,38,0.20)] rounded-[20px] p-6 mt-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#DC2626]" />
            
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} color="#DC2626" />
              <h2 className="font-sans text-[16px] font-bold text-[#DC2626] m-0">Danger Zone</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[rgba(220,38,38,0.03)] border border-[rgba(220,38,38,0.1)] rounded-xl p-5">
              <div>
                <h3 className="font-sans text-[15px] font-bold text-ink m-0">Delete Account</h3>
                <p className="font-sans text-[13px] text-muted mt-1 m-0">Permanently delete your account and all data. This cannot be undone.</p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="shrink-0 bg-transparent border-[1.5px] border-[rgba(220,38,38,0.30)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.06)] font-sans text-[14px] font-bold px-5 py-2.5 rounded-[10px] transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
