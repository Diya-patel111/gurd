import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './components/DashboardHome';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import RequestForm from './components/RequestForm';
import SmartButton from './components/SmartButton';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Example Equipment ID for the Smart Button demo
  const exampleEquipmentId = "642f1b2c9d3e1a0012345678"; 

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome onViewChange={setCurrentView} />;
      case 'kanban':
        return <KanbanBoard />;
      case 'calendar':
        return <CalendarView />;
      case 'requests':
        return <RequestForm onSuccess={() => setCurrentView('kanban')} onCancel={() => setCurrentView('dashboard')} />;
      case 'equipment':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Equipment Management</h2>
            <div className="border p-4 rounded-lg mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">Hydraulic Press #1</h3>
                <p className="text-sm text-gray-500">Serial: HP-2023-001</p>
              </div>
              <SmartButton equipmentId={exampleEquipmentId} />
            </div>
            <p className="text-gray-500 text-sm italic">More equipment would be listed here...</p>
          </div>
        );
      default:
        return <DashboardHome onViewChange={setCurrentView} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'kanban': return 'Maintenance Kanban Board';
      case 'calendar': return 'Preventive Schedule';
      case 'requests': return 'Create Request';
      case 'equipment': return 'Equipment Registry';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 flex flex-col">
        <Header title={getTitle()} />
        
        <main className="ml-64 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
