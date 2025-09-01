import { Session, Settings } from '../types';

const SESSIONS_KEY = 'focustimer_sessions';
const SETTINGS_KEY = 'focustimer_settings';

export const storage = {
  getSessions(): Session[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      if (!data) return [];
      
      const sessions = JSON.parse(data);
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
      }));
    } catch {
      return [];
    }
  },

  saveSessions(sessions: Session[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  addSession(session: Session): void {
    const sessions = this.getSessions();
    sessions.push(session);
    this.saveSessions(sessions);
  },

  deleteSession(sessionId: string): void {
    const sessions = this.getSessions().filter(s => s.id !== sessionId);
    this.saveSessions(sessions);
  },

  getSettings(): Settings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        const defaultSettings: Settings = {
          weeklyGoal: 80,
          exitFullscreenOnPause: true,
        };
        this.saveSettings(defaultSettings);
        return defaultSettings;
      }
      return JSON.parse(data);
    } catch {
      const defaultSettings: Settings = {
        weeklyGoal: 80,
        exitFullscreenOnPause: true,
      };
      this.saveSettings(defaultSettings);
      return defaultSettings;
    }
  },

  saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  clearAllData(): void {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  },

  exportToCSV(): string {
    const sessions = this.getSessions();
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

  exportToJSON(): string {
    const sessions = this.getSessions();
    const settings = this.getSettings();
    
    return JSON.stringify({
      sessions,
      settings,
      exportDate: new Date().toISOString(),
    }, null, 2);
  },

  importFromJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.sessions && Array.isArray(data.sessions)) {
        const sessions = data.sessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
        }));
        this.saveSessions(sessions);
      }
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      return true;
    } catch {
      return false;
    }
  },
};