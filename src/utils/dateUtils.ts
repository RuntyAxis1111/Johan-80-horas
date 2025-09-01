import { startOfWeek, endOfWeek, format, isWithinInterval, startOfDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Session, DailyStats, HourlyStats, HeatMapData } from '../types';

export const dateUtils = {
  getCurrentWeekStart(): Date {
    return startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  },

  getCurrentWeekEnd(): Date {
    return endOfWeek(new Date(), { weekStartsOn: 1 }); // Sunday
  },

  getWeeklyProgress(sessions: Session[], weeklyGoal: number) {
    const weekStart = this.getCurrentWeekStart();
    const weekEnd = this.getCurrentWeekEnd();
    
    const weekSessions = sessions.filter(session =>
      isWithinInterval(session.startTime, { start: weekStart, end: weekEnd })
    );
    
    const totalSeconds = weekSessions.reduce((sum, session) => sum + session.duration, 0);
    const totalHours = totalSeconds / 3600;
    const percentage = Math.min((totalHours / weeklyGoal) * 100, 100);
    const remainingHours = Math.max(weeklyGoal - totalHours, 0);
    
    return {
      totalHours,
      percentage,
      remainingHours,
      weekStart: format(weekStart, 'dd/MM', { locale: es }),
      weekEnd: format(weekEnd, 'dd/MM', { locale: es }),
    };
  },

  getDailyStats(sessions: Session[]): DailyStats[] {
    const weekStart = this.getCurrentWeekStart();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dayStart = startOfDay(date);
      const dayEnd = addDays(dayStart, 1);
      
      const daySessions = sessions.filter(session =>
        isWithinInterval(session.startTime, { start: dayStart, end: dayEnd })
      );
      
      const totalSeconds = daySessions.reduce((sum, session) => sum + session.duration, 0);
      const hours = totalSeconds / 3600; // Keep as decimal hours for chart
      
      return {
        date: format(date, 'EEE', { locale: es }),
        hours: Math.round(hours * 10000) / 10000, // More precision for small values
      };
    });
    
    return days;
  },

  getHourlyStats(sessions: Session[]): HourlyStats[] {
    const hourlyData: { [hour: number]: number } = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = 0;
    }
    
    sessions.forEach(session => {
      const startHour = session.startTime.getHours();
      const endHour = session.endTime.getHours();
      
      if (startHour === endHour) {
        // Session within same hour
        hourlyData[startHour] += session.duration / 60; // Convert to minutes
      } else {
        // Session spans multiple hours - distribute proportionally
        const startMinutes = session.startTime.getMinutes();
        const startSeconds = session.startTime.getSeconds();
        const endMinutes = session.endTime.getMinutes();
        const endSeconds = session.endTime.getSeconds();
        
        // First hour
        const firstHourSeconds = (60 - startMinutes - 1) * 60 + (60 - startSeconds);
        hourlyData[startHour] += firstHourSeconds / 60;
        
        // Middle hours
        for (let hour = startHour + 1; hour < endHour; hour++) {
          hourlyData[hour] += 60;
        }
        
        // Last hour
        if (endHour !== startHour) {
          const lastHourSeconds = endMinutes * 60 + endSeconds;
          hourlyData[endHour] += lastHourSeconds / 60;
        }
      }
    });
    
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      minutes: Math.round(hourlyData[hour] * 100) / 100, // Keep 2 decimal places for precision
    }));
  },

  getHeatMapData(sessions: Session[]): HeatMapData[] {
    const heatData: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      const dayOfWeek = (session.startTime.getDay() + 6) % 7; // Convert to Monday=0
      const hour = session.startTime.getHours();
      const key = `${dayOfWeek}-${hour}`;
      
      if (!heatData[key]) {
        heatData[key] = 0;
      }
      
      heatData[key] += session.duration / 60; // Convert to minutes with precision
    });
    
    const result: HeatMapData[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`;
        result.push({
          day,
          hour,
          minutes: Math.round((heatData[key] || 0) * 100) / 100, // Keep 2 decimal places
        });
      }
    }
    
    return result;
  },

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  },

  formatDurationDetailed(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  },

  generateDemoData(): Session[] {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const sessions: Session[] = [];
    
    // Generate 2 weeks of demo data
    for (let day = 0; day < 14; day++) {
      const currentDay = new Date(twoWeeksAgo.getTime() + day * 24 * 60 * 60 * 1000);
      
      // Random 2-4 sessions per day
      const sessionCount = Math.floor(Math.random() * 3) + 2;
      
      for (let session = 0; session < sessionCount; session++) {
        const startHour = Math.floor(Math.random() * 8) + 9; // 9-16
        const startMinute = Math.floor(Math.random() * 60);
        const duration = Math.floor(Math.random() * 3600) + 1800; // 30-90 minutes
        
        const startTime = new Date(currentDay);
        startTime.setHours(startHour, startMinute, 0, 0);
        
        const endTime = new Date(startTime.getTime() + duration * 1000);
        
        sessions.push({
          id: crypto.randomUUID(),
          startTime,
          endTime,
          duration,
          source: 'local',
        });
      }
    }
    
    return sessions;
  },
};