import React, { useState } from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';
import { supabaseStorage } from '../utils/supabaseStorage';
import { dateUtils } from '../utils/dateUtils';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({ weeklyGoal: 80, exitFullscreenOnPause: true });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await supabaseStorage.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleWeeklyGoalChange = async (value: number) => {
    const newSettings = { ...settings, weeklyGoal: value };
    setSettings(newSettings);
    await supabaseStorage.saveSettings(newSettings);
  };

  const handleExitFullscreenChange = async (value: boolean) => {
    const newSettings = { ...settings, exitFullscreenOnPause: value };
    setSettings(newSettings);
    await supabaseStorage.saveSettings(newSettings);
  };

  const handleExportCSV = async () => {
    const csv = await supabaseStorage.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focustimer-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = async () => {
    const json = await supabaseStorage.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focustimer-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          if (await supabaseStorage.importFromJSON(content)) {
            alert('Datos importados correctamente');
            const newSettings = await supabaseStorage.getSettings();
            setSettings(newSettings);
          } else {
            alert('Error al importar los datos. Verifica que el archivo sea válido.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = async () => {
    const success = await supabaseStorage.clearAllData();
    if (success) {
      const newSettings = await supabaseStorage.getSettings();
      setSettings(newSettings);
      setShowConfirmDelete(false);
      alert('Todos los datos han sido eliminados');
    } else {
      alert('Error al eliminar los datos');
    }
  };

  const handleLoadDemoData = () => {
    const demoSessions = dateUtils.generateDemoData();
    storage.saveSessions([...storage.getSessions(), ...demoSessions]);
    alert('Datos de demostración cargados correctamente');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Configuración</h1>
          <div className="text-center py-8 text-gray-400">Cargando configuración...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Configuración</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Configuración General</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Semanal (horas)
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.weeklyGoal}
                  onChange={(e) => handleWeeklyGoalChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="exitFullscreen"
                  checked={settings.exitFullscreenOnPause}
                  onChange={(e) => handleExitFullscreenChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                />
                <label htmlFor="exitFullscreen" className="text-sm text-gray-300">
                  Salir de pantalla completa al pausar
                </label>
              </div>
            </div>
          </div>
          
          {/* Data Management */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Gestión de Datos</h2>
            
            <div className="space-y-3">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={18} />
                <span>Exportar a CSV</span>
              </button>
              
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download size={18} />
                <span>Exportar JSON</span>
              </button>
              
              <button
                onClick={handleImportJSON}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Upload size={18} />
                <span>Importar JSON</span>
              </button>
              
              <button
                onClick={handleLoadDemoData}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                <Database size={18} />
                <span>Cargar Datos Demo</span>
              </button>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="lg:col-span-2 bg-gray-900 rounded-lg p-6 border border-red-500">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Zona Peligrosa</h2>
            
            {!showConfirmDelete ? (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                <Trash2 size={18} />
                <span>Borrar Todos los Datos</span>
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-300">
                  ⚠️ Esta acción eliminará permanentemente todas tus sesiones y configuración. 
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Sí, eliminar todo
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;