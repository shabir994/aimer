export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      emotions: {
        Row: {
          id: string
          user_id: string
          type: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          data?: Json
          created_at?: string
        }
      }
      suggestions: {
        Row: {
          id: string
          emotion_id: string
          title: string
          description: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          emotion_id: string
          title: string
          description: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          emotion_id?: string
          title?: string
          description?: string
          type?: string
          created_at?: string
        }
      }
    }
  }
}