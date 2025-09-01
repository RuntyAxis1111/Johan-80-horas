export interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  source: 'local';
}

export interface Settings {
  weeklyGoal: number; // in hours
  exitFullscreenOnPause: boolean;
}

export interface DailyStats {
  date: string;
  hours: number;
}

export interface HourlyStats {
  hour: number;
  minutes: number;
}

export interface HeatMapData {
  day: number; // 0-6 (Monday-Sunday)
  hour: number; // 0-23
  minutes: number;
}