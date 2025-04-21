import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  Calendar,
  Clock,
  BarChart2,
  RefreshCw,
  Camera,
  Mic,
  MessageSquare,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { dashboardAPI } from '../lib/api/mockData';

const EmotionalAnalysis = () => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emotionData, setEmotionData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentMood = {
    happiness: 85,
    stress: 25,
    energy: 70,
    anxiety: 20,
  };

  const emotionSources = [
    { icon: Camera, label: 'Facial Expression', value: '😊 Happy' },
    { icon: Mic, label: 'Voice Tone', value: 'Positive' },
    { icon: MessageSquare, label: 'Text Analysis', value: 'Optimistic' },
  ];

  const moodIndicators = [
    { icon: Smile, label: 'Happiness', value: currentMood.happiness, color: 'text-green-500' },
    { icon: Frown, label: 'Stress', value: currentMood.stress, color: 'text-red-500' },
    { icon: TrendingUp, label: 'Energy', value: currentMood.energy, color: 'text-blue-500' },
    { icon: Meh, label: 'Anxiety', value: currentMood.anxiety, color: 'text-yellow-500' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [realtimeData, trendsData] = await Promise.all([
          dashboardAPI.getRealtimeEmotions(),
          dashboardAPI.getEmotionalTrends()
        ]);

        setEmotionData(realtimeData);
        setWeeklyData(trendsData);
      } catch (error) {
        console.error('Error fetching emotion data:', error);
        setError('Failed to load emotional analysis data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading emotional analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg max-w-md text-center">
          <p>{error}</p>
          <button
            onClick={handleRefresh}
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
          <h1 className="text-2xl font-bold text-gray-900">Emotional Analysis</h1>
          <p className="text-gray-600">Track and analyze your emotional well-being in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Real-time Mood Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {moodIndicators.map((indicator, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <indicator.icon className={`w-8 h-8 ${indicator.color}`} />
              <span className="text-2xl font-bold">{indicator.value}%</span>
            </div>
            <h3 className="text-gray-600 font-medium">{indicator.label}</h3>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  indicator.color.replace('text', 'bg')
                } transition-all duration-500`}
                style={{ width: `${indicator.value}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex p-4 gap-4">
            <button
              onClick={() => setActiveTab('realtime')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'realtime'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Real-time Analysis
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'trends'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Emotional Trends
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'realtime' ? (
            <div className="space-y-6">
              {/* Real-time Detection Sources */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {emotionSources.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <source.icon className="w-6 h-6 text-blue-600" />
                      <h3 className="font-medium text-gray-900">{source.label}</h3>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{source.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Real-time Chart */}
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={emotionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="happiness"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Weekly Emotional Distribution */}
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Emotional Pattern Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Performance Times</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Most Productive: 9:00 AM - 11:00 AM</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Best Day: Wednesday</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart2 className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">Weekly Happiness Average: 82%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      • Your emotional well-being peaks during morning hours
                    </p>
                    <p className="text-gray-600">
                      • Stress levels are lowest during weekends
                    </p>
                    <p className="text-gray-600">
                      • Social interactions boost your mood significantly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionalAnalysis;