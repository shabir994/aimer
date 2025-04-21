import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionAnalysisRequest {
  type: 'text' | 'voice' | 'image';
  data: string;
}

interface EmotionAnalysisResponse {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate request
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    // Parse request body
    const { type, data }: EmotionAnalysisRequest = await req.json();

    // Validate required fields
    if (!type || !data) {
      throw new Error('Type and data are required fields');
    }

    if (!['text', 'voice', 'image'].includes(type)) {
      throw new Error('Invalid type. Must be text, voice, or image');
    }

    // Simulate AI analysis based on input type
    let emotions = {
      happiness: 0,
      sadness: 0,
      neutral: 0,
      stress: 0,
      energy: 0
    };

    // In a real implementation, you would use proper AI models for each type
    switch (type) {
      case 'text':
        emotions = {
          happiness: Math.random() * 100,
          sadness: Math.random() * 50,
          neutral: Math.random() * 70,
          stress: Math.random() * 60,
          energy: Math.random() * 90
        };
        break;

      case 'voice':
        emotions = {
          happiness: Math.random() * 90,
          sadness: Math.random() * 40,
          neutral: Math.random() * 60,
          stress: Math.random() * 50,
          energy: Math.random() * 80
        };
        break;

      case 'image':
        emotions = {
          happiness: Math.random() * 85,
          sadness: Math.random() * 30,
          neutral: Math.random() * 50,
          stress: Math.random() * 40,
          energy: Math.random() * 70
        };
        break;
    }

    // Generate personalized suggestions based on emotional state
    const suggestions = [
      {
        title: 'Take Deep Breaths',
        description: 'Practice deep breathing for 2 minutes to reduce stress levels.',
        type: 'Exercise'
      },
      {
        title: 'Positive Affirmations',
        description: 'Repeat positive statements to boost your mood.',
        type: 'Mental'
      },
      {
        title: 'Quick Walk',
        description: 'A 5-minute walk can help clear your mind.',
        type: 'Physical'
      }
    ];

    const response: EmotionAnalysisResponse = {
      emotions,
      suggestions
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );

  } catch (error) {
    // Ensure error response is properly formatted
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 400
      }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});