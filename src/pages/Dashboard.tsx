import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  HeadphonesIcon, 
  TrendingUp,
  Users,
  Clock,
  Loader2,
  X,
  Smile,
  Frown,
  Meh,
  Send,
  CheckCircle
} from 'lucide-react';
import EmotionGraph from '../components/EmotionGraph';
import { dashboardAPI, DashboardStats, EmotionProgress, Recommendation, EmotionalAnalysis } from '../lib/api/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [emotionProgress, setEmotionProgress] = useState<EmotionProgress[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [analysis, setAnalysis] = useState<EmotionalAnalysis>({
    mood: 5,
    energy: 5,
    stress: 5,
    notes: ''
  });

  const { t } = useLanguage();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, progressData, recommendationsData] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getEmotionProgress(),
          dashboardAPI.getRecommendations()
        ]);

        setStats(statsData);
        setEmotionProgress(progressData);
        setRecommendations(recommendationsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(t('failed_to_load_dashboard_data'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [t]);

  const handleAnalysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await dashboardAPI.submitAnalysis(analysis);
      setShowSuccess(true);
      setTimeout(() => {
        setShowAnalysisModal(false);
        setShowSuccess(false);
        // Reset form
        setAnalysis({
          mood: 5,
          energy: 5,
          stress: 5,
          notes: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting analysis:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    min: number = 0,
    max: number = 10
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{value}/10</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-gray-500 text-sm">
        <span>{t('low')}</span>
        <span>{t('high')}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">{t('loading_dashboard_data')}</p>
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
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
          >
            {t('try_again')}
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'brain':
        return Brain;
      case 'trending-up':
        return TrendingUp;
      case 'users':
        return Users;
      default:
        return Brain;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('welcome_back')}</h1>
          <p className="text-gray-600">{t('dashboard_description')}</p>
        </div>
        <button 
          onClick={() => setShowAnalysisModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-200"
        >
          {t('new_analysis')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: t('emotional_score'),
            value: `${stats.emotionalScore.value}%`,
            change: `${stats.emotionalScore.change > 0 ? '+' : ''}${stats.emotionalScore.change}%`,
            icon: Brain,
            color: "from-blue-600 to-purple-600"
          },
          {
            title: t('motivation_level'),
            value: `${stats.motivationLevel.value}%`,
            change: `${stats.motivationLevel.change > 0 ? '+' : ''}${stats.motivationLevel.change}%`,
            icon: Sparkles,
            color: "from-amber-500 to-orange-600"
          },
          {
            title: t('active_minutes'),
            value: stats.activeMinutes.value.toString(),
            change: `${stats.activeMinutes.change > 0 ? '+' : ''}${stats.activeMinutes.change}`,
            icon: Clock,
            color: "from-emerald-500 to-teal-600"
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-semibold ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Graph Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('emotional_progress')}</h2>
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
            <option>{t('last_7_days')}</option>
            <option>{t('last_30_days')}</option>
            <option>{t('last_3_months')}</option>
          </select>
        </div>
        <EmotionGraph />
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('ai_recommendations')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => {
            const Icon = getIcon(rec.icon);
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <Icon className={`w-8 h-8 ${rec.color} mb-4`} />
                <h3 className="font-semibold text-gray-900 mb-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm">{rec.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* New Analysis Modal */}
      <AnimatePresence>
        {showAnalysisModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('new_emotional_analysis')}</h2>
                </div>
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleAnalysisSubmit} className="p-6 space-y-6">
                {/* Mood Slider */}
                {renderSlider(
                  t('mood_slider_label'),
                  analysis.mood,
                  (value) => setAnalysis(prev => ({ ...prev, mood: value }))
                )}

                {/* Energy Slider */}
                {renderSlider(
                  t('energy_slider_label'),
                  analysis.energy,
                  (value) => setAnalysis(prev => ({ ...prev, energy: value }))
                )}

                {/* Stress Slider */}
                {renderSlider(
                  t('stress_slider_label'),
                  analysis.stress,
                  (value) => setAnalysis(prev => ({ ...prev, stress: value }))
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('additional_notes')}
                  </label>
                  <textarea
                    value={analysis.notes}
                    onChange={(e) => setAnalysis(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder={t('notes_placeholder')}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Mood Indicators */}
                <div className="flex justify-center gap-8 py-4">
                  {[
                    { icon: Frown, label: t('low'), color: analysis.mood <= 3 ? 'text-red-500' : 'text-gray-300' },
                    { icon: Meh, label: t('neutral'), color: analysis.mood > 3 && analysis.mood <= 7 ? 'text-yellow-500' : 'text-gray-300' },
                    { icon: Smile, label: t('high'), color: analysis.mood > 7 ? 'text-green-500' : 'text-gray-300' }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAnalysisModal(false)}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    disabled={submitting}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('analyzing')}
                      </>
                    ) : showSuccess ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {t('completed')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t('submit_analysis')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
