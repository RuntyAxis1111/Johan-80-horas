import React from 'react';
import WeeklyProgress from '../components/WeeklyProgress';
import DailyChart from '../components/DailyChart';
import HourlyChart from '../components/HourlyChart';
import HeatMap from '../components/HeatMap';
import SessionsTable from '../components/SessionsTable';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Analytics</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Weekly Progress */}
          <WeeklyProgress />
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyChart />
            <HourlyChart />
          </div>
          
          {/* Heat Map */}
          <HeatMap />
          
          {/* Sessions Table */}
          <SessionsTable />
        </div>
      </div>
    </div>
  );
};

export default Analytics;