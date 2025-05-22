import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Trophy,
  MessageSquare,
  Send,
  Sparkles,
  Star,
  Plus,
  Trash2,
  X,
  Calendar,
  Tag,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { dashboardAPI, Goal, Achievement, DailyQuote, ChatMessage } from '../lib/api/mockData';

const MotivationHub = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const [chatMessage, setChatMessage] = useState('');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [dailyQuotes, setDailyQuotes] = useState<DailyQuote[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id' | 'progress' | 'status'>>({
    title: '',
    category: 'Health',
    deadline: new Date().toISOString().split('T')[0],
    description: ''
  });

  const categories = [
    { value: 'Health', label: 'Health & Fitness' },
    { value: 'Career', label: 'Career & Professional' },
    { value: 'Education', label: 'Education & Learning' },
    { value: 'Personal', label: 'Personal Development' },
    { value: 'Financial', label: 'Financial Goals' },
    { value: 'Creative', label: 'Creative Projects' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [goalsData, achievementsData, quotesData, chatHistoryData] = await Promise.all([
        dashboardAPI.getGoals(),
        dashboardAPI.getAchievements(),
        dashboardAPI.getDailyQuotes(),
        dashboardAPI.getChatHistory()
      ]);

      setGoals(goalsData);
      setAchievements(achievementsData);
      setDailyQuotes(quotesData);
      setChatHistory(chatHistoryData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const goal = await dashboardAPI.addGoal(newGoal);
      setGoals(prev => [...prev, goal]);
      setIsNewGoalModalOpen(false);
      setNewGoal({
        title: '',
        category: 'Health',
        deadline: new Date().toISOString().split('T')[0],
        description: ''
      });
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await dashboardAPI.deleteGoal(id);
      setGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isTyping) return;

    try {
      // Add user message to chat history
      const userMessage: ChatMessage = {
        id: Date.now(),
        type: 'user',
        message: chatMessage,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, userMessage]);
      setChatMessage('');
      setIsTyping(true);

      // Prepare messages for API - maintain conversation context
      const messages = [
        {
          role: 'system',
          content: 'You are an enthusiastic motivational AI assistant that helps with goal setting and personal development. Keep responses concise, positive, and inspiring.'
        },
        ...chatHistory.slice(-6).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.message
        })),
        {
          role: 'user',
          content: chatMessage
        }
      ];

      // Call DeepSeek API with enhanced error handling
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-20dd0fe2674b4cf189a90c0c8f86a649`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      // Check for both network and API errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      const aiMessage = data.choices[0].message.content;

      // Add AI response to chat history
      const aiChatMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: aiMessage,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, aiChatMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Add more helpful error message
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: 'I apologize for the inconvenience. Let me try that again. ' + 
                 'Could you please rephrase your question or ask something else?',
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading motivation hub data...</p>
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
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Motivation Hub</h1>
          <p className="text-gray-600">Your personal space for motivation and goal achievement</p>
        </div>
        <button 
          onClick={() => setIsNewGoalModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          New Goal
        </button>
      </div>

      {/* Daily AI Quote Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dailyQuotes.map((quote, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {quote.mood}
              </span>
            </div>
            <blockquote className="text-lg text-gray-800 mb-4">"{quote.quote}"</blockquote>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>- {quote.author}</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {quote.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex p-4 gap-4">
            {['goals', 'achievements', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'goals' && (
            <div className="space-y-6">
              {goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        goal.status === 'On Track' ? 'bg-green-100 text-green-600' :
                        goal.status === 'Behind Schedule' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {goal.status}
                      </span>
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{goal.category}</span>
                      <span className="text-gray-600">Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold">{achievement.title}</h3>
                  </div>
                  <p className="text-white/80 mb-4">{achievement.description}</p>
                  <div className="text-sm text-white/60">
                    Achieved on {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 rounded-xl p-4 mb-4 h-[400px] overflow-y-auto flex flex-col">
                {chatHistory.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                      <Sparkles className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Hello! I'm your AI motivation assistant</h3>
                    <p className="text-gray-600 max-w-md">How can I help you with your goals and motivation today?</p>
                  </div>
                )}
                
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${
                      msg.type === 'user' ? 'flex-row-reverse' : ''
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        msg.type === 'user' ? 'bg-blue-600' : 'bg-white'
                      }`}>
                        {msg.type === 'user' ? (
                          <MessageSquare className="w-5 h-5 text-white" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className={`px-4 py-3 rounded-xl ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white shadow-md'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="flex items-start gap-3 max-w-[80%]">
                      <div className="p-2 rounded-lg bg-white">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="px-4 py-3 rounded-xl bg-white shadow-md flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping || !chatMessage.trim()}
                  className={`px-6 py-3 rounded-xl transition-colors duration-200 ${
                    isTyping || !chatMessage.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Goal Modal */}
      <AnimatePresence>
        {isNewGoalModalOpen && (
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
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Goal</h2>
                </div>
                <button
                  onClick={() => setIsNewGoalModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleNewGoalSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Goal Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      placeholder="Enter your goal title"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                    <Target className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                      Deadline
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="deadline"
                        value={newGoal.deadline}
                        min={minDate}
                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 appearance-none bg-white text-gray-700"
                        required
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal and what you want to achieve..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                    required
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-600">
                    Setting specific, measurable, achievable, relevant, and time-bound (SMART) goals increases your chances of success.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsNewGoalModalOpen(false)}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Goal
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

export default MotivationHub;