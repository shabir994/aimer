import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI, Profile as ProfileType } from '../lib/profile';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await profileAPI.getProfile(user.id);
      if (!data) {
        setError('Profile not found. Please contact support if this issue persists.');
        return;
      }
      setProfile(data);
    } catch (error) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await profileAPI.updateProfile(user.id, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone || null,
        location: profile.location || null,
        bio: profile.bio || null
      });
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setError(null);
      setSaving(true);
      const avatarUrl = await profileAPI.uploadAvatar(user.id, file);
      setProfile(prev => prev ? {
        ...prev,
        avatar_url: avatarUrl
      } : null);
      setSuccess('Avatar updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to upload avatar');
      console.error('Error uploading avatar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg max-w-md text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Profile Not Found</p>
          <p className="mb-4">We couldn't find your profile information. This might happen if your profile hasn't been properly set up.</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Status Messages */}
      {(error || success) && (
        <div className={`p-4 rounded-lg ${
          error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          <div className="flex items-center gap-2">
            {error ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            <p>{error || success}</p>
          </div>
        </div>
      )}

      {/* Profile Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"
            >
              <Camera size={20} />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
            <p className="text-gray-600 mb-4">{profile.bio || 'No bio added yet'}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={18} />
                <span>{profile.phone || 'No phone added'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>{profile.location || 'No location added'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;