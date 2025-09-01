import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { supabaseStorage } from '../utils/supabaseStorage';
import { dateUtils } from '../utils/dateUtils';

const WeeklyProgress: React.FC = () => {
  const [sessions, setSessions] = React.useState([]);
  const [settings, setSettings] = React.useState({ weeklyGoal: 80, exitFullscreenOnPause: true });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionsData, settingsData] = await Promise.all([
          supabaseStorage.getSessions(),
          supabaseStorage.getSettings()
        ]);
        setSessions(sessionsData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="text-blue-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Progreso Semanal</h2>
        </div>
        <div className="text-center py-8 text-gray-400">Cargando...</div>
      </div>
    );
  }

  const progress = dateUtils.getWeeklyProgress(sessions, settings.weeklyGoal);
  
  const totalSeconds = sessions
    .filter(session => {
      const weekStart = dateUtils.getCurrentWeekStart();
      const weekEnd = dateUtils.getCurrentWeekEnd();
      return session.startTime >= weekStart && session.startTime <= weekEnd;
    })
    .reduce((sum, session) => sum + session.duration, 0);

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center space-x-3 mb-4">
        <Target className="text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">Progreso Semanal</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">
            {dateUtils.formatDurationDetailed(totalSeconds)}
          </div>
          <div className="text-sm text-gray-400">Trabajadas</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {progress.percentage.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Completado</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-400">
            {progress.remainingHours.toFixed(1)}h
          </div>
          <div className="text-sm text-gray-400">Restantes</div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Semana {progress.weekStart} - {progress.weekEnd}</span>
          <span>Meta: {settings.weeklyGoal}h</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;