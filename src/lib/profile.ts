import { supabase } from './supabase';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export const profileAPI = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },

  async createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            ...profile,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // First, delete the old avatar if it exists
      const { data: oldProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (oldProfile?.avatar_url) {
        const oldFileName = oldProfile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([`avatars/${oldFileName}`]);
        }
      }

      // Upload the new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the profile with the new avatar URL
      await this.updateProfile(userId, { avatar_url: publicUrl });

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      throw error;
    }
  },

  async deleteAvatar(userId: string): Promise<void> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (profile?.avatar_url) {
        const fileName = profile.avatar_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([`avatars/${fileName}`]);
        }

        await this.updateProfile(userId, { avatar_url: null });
      }
    } catch (error) {
      console.error('Error in deleteAvatar:', error);
      throw error;
    }
  }
};