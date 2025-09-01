import { supabase } from '../lib/supabase';
import { Session, Settings } from '../types';

// Usuario predeterminado para Johan
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

export const supabaseStorage = {
  getCurrentUserId() {
    return DEFAULT_USER_ID;
  },

  async getSessions(): Promise<Session[]> {
    try {
      const userId = this.getCurrentUserId();

      const { data, error } = await supabase
        .from('johan_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false });

      if (error) throw error;

      return (data || []).map(session => ({
        id: session.id,
        startTime: new Date(session.start_time),
        endTime: new Date(session.end_time),
        duration: session.duration,
        source: session.source || 'web',
      }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  },

  async addSession(session: Omit<Session, 'id'>): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();

      const { error } = await supabase
        .from('johan_sessions')
        .insert({
          user_id: userId,
          start_time: session.startTime.toISOString(),
          end_time: session.endTime.toISOString(),
          duration: session.duration,
          source: session.source || 'web',
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  },

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();

      const { error } = await supabase
        .from('johan_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  },

  async getSettings(): Promise<Settings> {
    try {
      const userId = this.getCurrentUserId();

      const { data, error } = await supabase
        .from('johan_settings')
        .select('*')
        .eq('user_id', userId)
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { weeklyGoal: 80, exitFullscreenOnPause: true };
      }

      const settings = data[0];
      return {
        weeklyGoal: settings.weekly_goal,
        exitFullscreenOnPause: settings.exit_fullscreen_on_pause,
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { weeklyGoal: 80, exitFullscreenOnPause: true };
    }
  },

  async saveSettings(settings: Settings): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();

      const { error } = await supabase
        .from('johan_settings')
        .upsert({
          user_id: userId,
          weekly_goal: settings.weeklyGoal,
          exit_fullscreen_on_pause: settings.exitFullscreenOnPause,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  async clearAllData(): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();

      // Delete all sessions
      const { error: sessionsError } = await supabase
        .from('johan_sessions')
        .delete()
        .eq('user_id', userId);

      if (sessionsError) throw sessionsError;

      // Reset settings to default
      const { error: settingsError } = await supabase
        .from('johan_settings')
        .upsert({
          user_id: userId,
          weekly_goal: 80,
          exit_fullscreen_on_pause: true,
        });

      if (settingsError) throw settingsError;
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },

  async exportToCSV(): Promise<string> {
    const sessions = await this.getSessions();
    const header = 'Fecha,Inicio,Fin,Duración (min)\n';
    const rows = sessions.map(session => {
      const date = session.startTime.toLocaleDateString('es-MX');
      const start = session.startTime.toLocaleTimeString('es-MX', { hour12: false });
      const end = session.endTime.toLocaleTimeString('es-MX', { hour12: false });
      const duration = Math.round(session.duration / 60);
      return `${date},${start},${end},${duration}`;
    }).join('\n');
    
    return header + rows;
  },

  async exportToJSON(): Promise<string> {
    const sessions = await this.getSessions();
    const settings = await this.getSettings();
    
    return JSON.stringify({
      sessions,
      settings,
      exportDate: new Date().toISOString(),
    }, null, 2);
  },

  async importFromJSON(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.sessions && Array.isArray(data.sessions)) {
        for (const sessionData of data.sessions) {
          const session = {
            startTime: new Date(sessionData.startTime),
            endTime: new Date(sessionData.endTime),
            duration: sessionData.duration,
            source: sessionData.source || 'imported',
          };
          await this.addSession(session);
        }
      }
      
      if (data.settings) {
        await this.saveSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
};