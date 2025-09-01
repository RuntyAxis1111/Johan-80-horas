import React from 'react';
import { Activity } from 'lucide-react';
import { supabaseStorage } from '../utils/supabaseStorage';
import { dateUtils } from '../utils/dateUtils';

const HeatMap: React.FC = () => {
  const [sessions, setSessions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await supabaseStorage.getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="text-blue-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Mapa de Calor (Día × Hora)</h2>
        </div>
        <div className="text-center py-8 text-gray-400">Cargando...</div>
      </div>
    );
  }

  const heatData = dateUtils.getHeatMapData(sessions);
  
  const maxMinutes = Math.max(...heatData.map(d => d.minutes), 1);
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  const getIntensity = (minutes: number) => {
    if (minutes === 0) return 0;
    return Math.min(minutes / maxMinutes, 1);
  };

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-800';
    if (intensity < 0.25) return 'bg-blue-900';
    if (intensity < 0.5) return 'bg-blue-700';
    if (intensity < 0.75) return 'bg-blue-500';
    return 'bg-blue-400';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center space-x-3 mb-4">
        <Activity className="text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">Mapa de Calor (Día × Hora)</h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="flex-1 text-center text-xs text-gray-400">
                {hour.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
          
          {/* Days and heat map */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-12 text-xs text-gray-400 pr-2">{day}</div>
              {Array.from({ length: 24 }, (_, hour) => {
                const cellData = heatData.find(d => d.day === dayIndex && d.hour === hour);
                const minutes = cellData?.minutes || 0;
                const intensity = getIntensity(minutes);
                const totalSeconds = Math.round(minutes * 60);
                const displayMinutes = Math.floor(totalSeconds / 60);
                const displaySeconds = totalSeconds % 60;
                
                const timeDisplay = totalSeconds < 60 
                  ? `${totalSeconds}s`
                  : `${displayMinutes}m ${displaySeconds}s`;
                
                return (
                  <div
                    key={hour}
                    className={`flex-1 aspect-square mx-px rounded-sm ${getColor(intensity)} group relative cursor-help`}
                    title={`${day} ${hour.toString().padStart(2, '0')}:00 – ${timeDisplay}`}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap border border-gray-700">
                        {day} {hour.toString().padStart(2, '0')}:00 – {timeDisplay}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <span className="text-xs text-gray-400">Menos</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
             <div className="w-3 h-3 bg-blue-900 rounded-sm"></div>
             <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
            </div>
            <span className="text-xs text-gray-400">Más</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;