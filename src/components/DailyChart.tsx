import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar } from 'lucide-react';
import { supabaseStorage } from '../utils/supabaseStorage';
import { dateUtils } from '../utils/dateUtils';

const DailyChart: React.FC = () => {
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
          <Calendar className="text-blue-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Horas por Día</h2>
        </div>
        <div className="text-center py-8 text-gray-400">Cargando...</div>
      </div>
    );
  }

  const data = dateUtils.getDailyStats(sessions);

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center space-x-3 mb-4">
        <Calendar className="text-blue-400" size={24} />
        <h2 className="text-xl font-semibold text-white">Horas por Día</h2>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6',
              }}
              formatter={(value: number) => {
                const totalSeconds = Math.round(value * 3600);
                if (totalSeconds < 60) {
                  return [`${totalSeconds}s`, 'Tiempo'];
                } else if (totalSeconds < 3600) {
                  const minutes = Math.floor(totalSeconds / 60);
                  const seconds = totalSeconds % 60;
                  return [`${minutes}m ${seconds}s`, 'Tiempo'];
                } else {
                  return [dateUtils.formatDurationDetailed(totalSeconds), 'Tiempo'];
                }
              }}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyChart;