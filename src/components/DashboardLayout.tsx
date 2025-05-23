import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Brain,
  Sparkles,
  HeadphonesIcon,
  UserCircle,
  Settings,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Languages,
  Loader2
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/profile';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, direction, t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await profileAPI.getProfile(user.id);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Set up a profile refresh interval
    const refreshInterval = setInterval(fetchProfile, 30000); // Refresh every 30 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { name: t('dashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { name: t('emotional_analysis'), icon: Brain, path: '/dashboard/emotional-analysis' },
    { name: t('motivation_hub'), icon: Sparkles, path: '/dashboard/motivation-hub' },
    { name: t('real_time_assistance'), icon: HeadphonesIcon, path: '/dashboard/real-time-assistance' },
    { name: t('profile'), icon: UserCircle, path: '/dashboard/profile' },
    { name: t('settings'), icon: Settings, path: '/dashboard/settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const languages = [
    { code: 'English', name: 'English', flag: '🇺🇸' },
    { code: 'العربية', name: 'العربية', flag: '🇦🇪' }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''}`} dir={direction}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: direction === 'ltr' ? -300 : 300 }}
        animate={{ x: isSidebarOpen ? 0 : (direction === 'ltr' ? -300 : 300) }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 ${direction === 'ltr' ? 'left-0' : 'right-0'} z-40 h-screen w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transform lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : direction === 'ltr' ? '-translate-x-full' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AIMER
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${
                  isActive(item.path) ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`} />
                <span className="font-medium">{item.name}</span>
                {isActive(item.path) && (
                  <ChevronRight className={`w-5 h-5 ml-auto text-white ${direction === 'rtl' ? 'transform rotate-180' : ''}`} />
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile Preview */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-600 p-4">
                {error}
              </div>
            ) : profile ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <img
                  src={profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
                  alt={profile.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {profile.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {profile.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-200 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? (direction === 'ltr' ? 'lg:ml-72' : 'lg:mr-72') : 'ml-0 mr-0'} transition-all duration-300`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Search className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Search Bar - Desktop */}
              <div className="hidden lg:relative lg:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('search')}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 w-64 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Languages className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">{language}</span>
                </button>
                {isLanguageDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'English' | 'العربية');
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                          language === lang.code
                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Bell className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className={`lg:hidden px-4 pb-4 ${isMobileSearchOpen ? 'block' : 'hidden'}`}>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('search')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;