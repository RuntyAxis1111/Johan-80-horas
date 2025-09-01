import React, { useState, useMemo } from 'react';
import { Trash2, Search } from 'lucide-react';
import { supabaseStorage } from '../utils/supabaseStorage';
import { dateUtils } from '../utils/dateUtils';

const SessionsTable: React.FC = () => {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  React.useEffect(() => {
    loadSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter(session => {
        if (!searchQuery) return true;
        const dateStr = session.startTime.toLocaleDateString('es-MX');
        return dateStr.includes(searchQuery);
      })
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }, [sessions, searchQuery]);

  const handleDelete = async (sessionId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta sesión?')) {
      const success = await supabaseStorage.deleteSession(sessionId);
      if (success) {
        await loadSessions();
      } else {
        alert('Error al eliminar la sesión');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Historial de Sesiones</h2>
        <div className="text-center py-8 text-gray-400">Cargando sesiones...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Historial de Sesiones</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por fecha..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 font-medium text-gray-300">Fecha</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Inicio</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Fin</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Duración</th>
              <th className="text-left py-3 px-4 font-medium text-gray-300">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="py-3 px-4 text-gray-300">
                  {session.startTime.toLocaleDateString('es-MX')}
                </td>
                <td className="py-3 px-4 text-gray-300 font-mono">
                  {session.startTime.toLocaleTimeString('es-MX', { hour12: false })}
                </td>
                <td className="py-3 px-4 text-gray-300 font-mono">
                  {session.endTime.toLocaleTimeString('es-MX', { hour12: false })}
                </td>
                <td className="py-3 px-4 text-gray-300 font-mono">
                  {dateUtils.formatDurationDetailed(session.duration)}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Eliminar sesión"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSessions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            {searchQuery ? 'No se encontraron sesiones.' : 'No hay sesiones registradas.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsTable;