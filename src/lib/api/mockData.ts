import { Notification } from '../contexts/NotificationContext';

export interface DashboardStats {
  emotionalScore: {
    value: number;
    change: number;
  };
  motivationLevel: {
    value: number;
    change: number;
  };
  activeMinutes: {
    value: number;
    change: number;
  };
}

export interface EmotionProgress {
  name: string;
  happiness: number;
  stress: number;
  energy: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: 'brain' | 'trending-up' | 'users';
  color: string;
}

export interface EmotionalAnalysis {
  mood: number;
  energy: number;
  stress: number;
  notes: string;
}

export interface EmotionAnalysisResponse {
  emotions: {
    happiness: number;
    sadness: number;
    neutral: number;
    stress: number;
    energy: number;
  };
  suggestions: Array<{
    title: string;
    description: string;
    type: string;
  }>;
}

export interface EmotionalTrends {
  positive: number;
  negative: number;
  neutral: number;
}

export interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
  category: string;
  status: 'On Track' | 'Behind Schedule' | 'In Progress' | 'Completed';
  description: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  date: string;
}

export interface DailyQuote {
  quote: string;
  author: string;
  category: string;
  mood: string;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  bio: string;
  avatar: string;
  notificationSettings: {
    emailUpdates: boolean;
    moodReminders: boolean;
    weeklyReports: boolean;
    achievementAlerts: boolean;
  };
  aiPreferences: {
    emotionalAnalysis: boolean;
    motivationalQuotes: boolean;
    exerciseReminders: boolean;
    socialSuggestions: boolean;
  };
  privacySettings: {
    shareProgress: boolean;
    publicProfile: boolean;
    anonymousData: boolean;
    dataCollection: boolean;
  };
}

export interface UserSettings {
  language: string;
  timezone: string;
  theme: 'light' | 'dark';
  volume: number;
  notifications: {
    emailUpdates: boolean;
    push: boolean;
    inApp: boolean;
    marketing: boolean;
    updates: boolean;
    sound: boolean;
  };
  privacy: {
    twoFactor: boolean;
    activityStatus: boolean;
    readReceipts: boolean;
    dataCollection: boolean;
  };
}

const chatResponses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What's on your mind?",
    "Welcome! I'm here to support you.",
    "Greetings! How are you feeling today?"
  ],
  motivation: [
    "Remember, every small step counts towards your bigger goals!",
    "You're doing great! Keep pushing forward.",
    "Success is built one day at a time. You've got this!",
    "Your dedication is inspiring. Keep up the amazing work!",
    "Sometimes the smallest step in the right direction ends up being the biggest step of your life.",
    "The only way to do great work is to love what you do. Keep that passion alive!"
  ],
  stress: [
    "I understand you're feeling stressed. Let's take a deep breath together.",
    "Would you like to try a quick relaxation exercise?",
    "Remember to take breaks when needed. Your well-being comes first.",
    "Stress is temporary. Let's focus on what we can control.",
    "Let's break down what's causing your stress and tackle it one step at a time.",
    "Sometimes stepping back and taking a moment for yourself is the best solution."
  ],
  goals: [
    "What specific goal would you like to work on?",
    "Breaking down goals into smaller tasks can make them more manageable.",
    "Let's create an action plan for your goal.",
    "Remember to celebrate small victories along the way!",
    "Would you like to explore some strategies for achieving this goal?",
    "Every goal starts with a single step. What's your first step going to be?"
  ],
  support: [
    "I'm here to support you. What's troubling you?",
    "You're not alone in this journey. How can I help?",
    "Sometimes talking about our challenges helps. What's on your mind?",
    "I'm listening. Feel free to share what you're going through.",
    "Your feelings are valid. Let's work through this together.",
    "What kind of support would be most helpful right now?"
  ],
  progress: [
    "You've come so far already! What progress are you most proud of?",
    "Every step forward is progress, no matter how small.",
    "Would you like to review your achievements so far?",
    "Let's celebrate your progress and plan your next steps.",
    "What positive changes have you noticed since you started?"
  ],
  reflection: [
    "How do you feel about that?",
    "What thoughts come to mind when you think about this?",
    "What would make you feel better in this situation?",
    "Is there something specific you'd like to focus on?",
    "How can we turn this challenge into an opportunity?"
  ],
  default: [
    "Tell me more about that.",
    "How does that make you feel?",
    "What are your thoughts on this?",
    "Let's explore that further.",
    "What would be most helpful for you right now?",
    "I'm here to listen and support you."
  ]
};

const analyzeMessage = (message: string): string => {
  message = message.toLowerCase();
  
  const patterns = {
    greeting: /\b(hi|hello|hey|greetings)\b/,
    motivation: /\b(motivate|inspire|encourage|push|drive|tired|lazy|unmotivated)\b/,
    stress: /\b(stress|anxiety|worried|nervous|overwhelm|pressure|tension|panic)\b/,
    goals: /\b(goal|achieve|accomplish|plan|target|objective|aim|aspire)\b/,
    support: /\b(help|support|guidance|advice|stuck|lost|confused|uncertain)\b/,
    progress: /\b(progress|improve|advance|growth|development|better|forward)\b/,
    reflection: /\b(think|feel|believe|wonder|consider|reflect|understand)\b/
  };

  const scores = Object.entries(patterns).reduce((acc, [category, pattern]) => {
    const matches = (message.match(pattern) || []).length;
    acc[category] = matches;
    return acc;
  }, {} as Record<string, number>);

  const maxScore = Math.max(...Object.values(scores));
  const matchedCategories = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([category]) => category);

  if (matchedCategories.length === 0 || maxScore === 0) {
    if (message.match(/\b(what|how|why|when|where|who)\b/)) {
      return getRandomResponse('reflection');
    }
    if (message.match(/\b(happy|sad|angry|frustrated|excited|scared)\b/)) {
      return getRandomResponse('support');
    }
    return getRandomResponse('default');
  }

  const selectedCategory = matchedCategories[Math.floor(Math.random() * matchedCategories.length)] as keyof typeof chatResponses;
  return getRandomResponse(selectedCategory);
};

const getRandomResponse = (category: keyof typeof chatResponses): string => {
  const responses = chatResponses[category];
  return responses[Math.floor(Math.random() * responses.length)];
};

class DashboardAPI {
  private notifications: Notification[] = [
    {
      id: '1',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You\'ve completed your first week of consistent tracking!',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      icon: 'Trophy',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      unread: true
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Daily Check-in Reminder',
      message: 'Don\'t forget to log your emotional state today',
      time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      icon: 'Bell',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      unread: true
    },
    {
      id: '3',
      type: 'support',
      title: 'New Resource Available',
      message: 'Check out our new guided meditation session',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      icon: 'Heart',
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
      unread: false
    }
  ];

  private goals: Goal[] = [
    {
      id: 1,
      title: "Complete 30-Day Fitness Challenge",
      progress: 60,
      deadline: "2024-03-31",
      category: "Health",
      status: "In Progress",
      description: "Daily workout routine to improve overall fitness"
    },
    {
      id: 2,
      title: "Read 12 Books This Year",
      progress: 25,
      deadline: "2024-12-31",
      category: "Personal Development",
      status: "On Track",
      description: "Reading one book per month to expand knowledge"
    },
    {
      id: 3,
      title: "Learn Spanish - B1 Level",
      progress: 45,
      deadline: "2024-06-30",
      category: "Education",
      status: "Behind Schedule",
      description: "Language learning through daily practice"
    }
  ];

  private achievements: Achievement[] = [
    {
      id: 1,
      title: "Early Bird",
      description: "Completed morning routine for 7 consecutive days",
      icon: "Clock",
      date: "2024-02-20"
    },
    {
      id: 2,
      title: "Goal Setter",
      description: "Created and achieved 5 personal goals",
      icon: "Target",
      date: "2024-02-15"
    },
    {
      id: 3,
      title: "Consistency King",
      description: "Maintained daily progress for 30 days",
      icon: "Trophy",
      date: "2024-02-10"
    }
  ];

  private dailyQuotes: DailyQuote[] = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "Success",
      mood: "Inspiring"
    },
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      category: "Perseverance",
      mood: "Motivating"
    },
    {
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "Dreams",
      mood: "Uplifting"
    }
  ];

  private chatHistory: ChatMessage[] = [
    {
      type: 'ai',
      message: 'Hello! I\'m your AI motivation assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ];

  private userProfile: UserProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: "January 2024",
    bio: "Passionate about personal growth and emotional well-being. Always looking to learn and improve.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
    notificationSettings: {
      emailUpdates: true,
      moodReminders: true,
      weeklyReports: true,
      achievementAlerts: true
    },
    aiPreferences: {
      emotionalAnalysis: true,
      motivationalQuotes: true,
      exerciseReminders: false,
      socialSuggestions: true
    },
    privacySettings: {
      shareProgress: true,
      publicProfile: false,
      anonymousData: true,
      dataCollection: true
    }
  };

  private userSettings: UserSettings = {
    language: 'English',
    timezone: 'UTC-5 (Eastern Time)',
    theme: 'light',
    volume: 80,
    notifications: {
      emailUpdates: true,
      push: true,
      inApp: true,
      marketing: false,
      updates: true,
      sound: true
    },
    privacy: {
      twoFactor: false,
      activityStatus: true,
      readReceipts: true,
      dataCollection: true
    }
  };

  async getStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      emotionalScore: {
        value: 85,
        change: 5
      },
      motivationLevel: {
        value: 92,
        change: 8
      },
      activeMinutes: {
        value: 127,
        change: 12
      }
    };
  }

  async getEmotionProgress(): Promise<EmotionProgress[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { name: 'Mon', happiness: 80, stress: 20, energy: 60 },
      { name: 'Tue', happiness: 65, stress: 45, energy: 50 },
      { name: 'Wed', happiness: 70, stress: 30, energy: 75 },
      { name: 'Thu', happiness: 85, stress: 15, energy: 80 },
      { name: 'Fri', happiness: 75, stress: 25, energy: 65 },
      { name: 'Sat', happiness: 90, stress: 10, energy: 85 },
      { name: 'Sun', happiness: 85, stress: 15, energy: 80 }
    ];
  }

  async getRecommendations(): Promise<Recommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: '1',
        title: 'Try Mindful Breathing',
        description: 'A 5-minute breathing exercise can help reduce stress.',
        icon: 'brain',
        color: 'text-blue-600'
      },
      {
        id: '2',
        title: 'Set a New Goal',
        description: 'Creating achievable goals boosts motivation.',
        icon: 'trending-up',
        color: 'text-purple-600'
      },
      {
        id: '3',
        title: 'Connect with Others',
        description: 'Social connections improve emotional well-being.',
        icon: 'users',
        color: 'text-emerald-600'
      }
    ];
  }

  async submitAnalysis(analysis: EmotionalAnalysis): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Analysis submitted:', analysis);
  }

  async analyzeEmotion(type: 'text' | 'voice' | 'image', data: string): Promise<EmotionAnalysisResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const happiness = Math.random() * 40 + 30;
    const sadness = Math.random() * 20;
    const neutral = Math.random() * 20;
    const stress = Math.random() * 30;
    const energy = Math.random() * 40 + 40;

    const suggestions = [
      {
        title: 'Take a Deep Breath',
        description: 'Practice deep breathing exercises for 5 minutes',
        type: 'Exercise'
      },
      {
        title: 'Quick Meditation',
        description: 'Try a short guided meditation session',
        type: 'Mental'
      },
      {
        title: 'Connect with Others',
        description: 'Reach out to a friend or family member',
        type: 'Social'
      }
    ];

    if (type === 'text' && data.toLowerCase().includes('stress')) {
      suggestions.push({
        title: 'Stress Relief',
        description: 'Try progressive muscle relaxation',
        type: 'Exercise'
      });
    }

    return {
      emotions: {
        happiness,
        sadness,
        neutral,
        stress,
        energy
      },
      suggestions: suggestions.slice(0, 3)
    };
  }

  async getEmotionalTrends(): Promise<EmotionalTrends[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { day: 'Mon', positive: 75, negative: 25, neutral: 45 },
      { day: 'Tue', positive: 85, negative: 15, neutral: 55 },
      { day: 'Wed', positive: 65, negative: 35, neutral: 40 },
      { day: 'Thu', positive: 90, negative: 10, neutral: 50 },
      { day: 'Fri', positive: 80, negative: 20, neutral: 60 },
      { day: 'Sat', positive: 95, negative: 5, neutral: 70 },
      { day: 'Sun', positive: 85, negative: 15, neutral: 55 }
    ];
  }

  async getRealtimeEmotions(): Promise<EmotionProgress[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { time: '9:00 AM', happiness: 80, stress: 20, energy: 60 },
      { time: '10:00 AM', happiness: 75, stress: 25, energy: 55 },
      { time: '11:00 AM', happiness: 85, stress: 15, energy: 70 },
      { time: '12:00 PM', happiness: 70, stress: 30, energy: 50 },
      { time: '1:00 PM', happiness: 90, stress: 10, energy: 80 },
      { time: '2:00 PM', happiness: 85, stress: 20, energy: 75 }
    ];
  }

  async getGoals(): Promise<Goal[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.goals];
  }

  async addGoal(goal: Omit<Goal, 'id' | 'progress' | 'status'>): Promise<Goal> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newGoal: Goal = {
      id: this.goals.length + 1,
      progress: 0,
      status: 'In Progress',
      ...goal
    };

    this.goals.push(newGoal);
    return newGoal;
  }

  async deleteGoal(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.goals = this.goals.filter(goal => goal.id !== id);
  }

  async getAchievements(): Promise<Achievement[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.achievements];
  }

  async getDailyQuotes(): Promise<DailyQuote[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.dailyQuotes];
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.chatHistory];
  }

  async sendChatMessage(message: string): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userMessage: ChatMessage = {
      type: 'user',
      message,
      timestamp: new Date().toISOString()
    };
    this.chatHistory.push(userMessage);

    const aiResponse = analyzeMessage(message);

    const aiMessage: ChatMessage = {
      type: 'ai',
      message: aiResponse,
      timestamp: new Date().toISOString()
    };
    this.chatHistory.push(aiMessage);

    return [...this.chatHistory];
  }

  async getUserProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.userProfile };
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.userProfile = {
      ...this.userProfile,
      ...profile
    };
    return { ...this.userProfile };
  }

  async updateNotificationSettings(settings: Partial<UserProfile['notificationSettings']>): Promise<UserProfile['notificationSettings']> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.userProfile.notificationSettings = {
      ...this.userProfile.notificationSettings,
      ...settings
    };
    return { ...this.userProfile.notificationSettings };
  }

  async updateAIPreferences(preferences: Partial<UserProfile['aiPreferences']>): Promise<UserProfile['aiPreferences']> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.userProfile.aiPreferences = {
      ...this.userProfile.aiPreferences,
      ...preferences
    };
    return { ...this.userProfile.aiPreferences };
  }

  async updatePrivacySettings(settings: Partial<UserProfile['privacySettings']>): Promise<UserProfile['privacySettings']> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.userProfile.privacySettings = {
      ...this.userProfile.privacySettings,
      ...settings
    };
    return { ...this.userProfile.privacySettings };
  }

  async uploadAvatar(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.userProfile.avatar;
  }

  async getUserSettings(): Promise<UserSettings> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...this.userSettings };
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.userSettings = {
      ...this.userSettings,
      ...settings
    };
    return { ...this.userSettings };
  }

  async updateNotificationPreferences(settings: Partial<UserSettings['notifications']>): Promise<UserSettings['notifications']> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.userSettings.notifications = {
      ...this.userSettings.notifications,
      ...settings
    };
    return { ...this.userSettings.notifications };
  }

  async updatePrivacyPreferences(settings: Partial<UserSettings['privacy']>): Promise<UserSettings['privacy']> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.userSettings.privacy = {
      ...this.userSettings.privacy,
      ...settings
    };
    return { ...this.userSettings.privacy };
  }

  async getNotifications(): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.notifications];
  }

  async checkNewNotifications(): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (Math.random() < 0.2) {
      const newNotification: Notification = {
        id: String(Date.now()),
        type: 'milestone',
        title: 'New Milestone!',
        message: 'You\'re making great progress!',
        time: new Date().toISOString(),
        icon: 'Star',
        color: 'text-purple-500',
        bgColor: 'bg-purple-100',
        unread: true
      };
      return [newNotification];
    }
    return [];
  }

  async addNotification(notification: Omit<Notification, 'id' | 'time'>): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newNotification: Notification = {
      ...notification,
      id: String(Date.now()),
      time: new Date().toISOString()
    };
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.notifications = this.notifications.map(notification =>
      notification.id === id ? { ...notification, unread: false } : notification
    );
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.notifications = this.notifications.map(notification => ({ ...notification, unread: false }));
  }

  async deleteNotification(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }

  async deleteAllNotifications(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.notifications = [];
  }
}

export const dashboardAPI = new DashboardAPI();