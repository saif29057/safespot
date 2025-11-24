import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Users, Zap } from 'lucide-react';

export default function AdminPrediction({ userName, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Navigation Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white
        transform transition-transform duration-300 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">SafeSpot</h1>
          <p className="text-sm text-blue-100 mt-1">Admin Panel</p>
        </div>

        <nav className="p-6 space-y-4">
          <a href="/admin" className="flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg transition">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </a>
          <a href="/admin/clients" className="flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-700 hover:text-white rounded-lg transition">
            <Users size={20} />
            <span>Gestion Clients</span>
          </a>
          <a href="/admin/prediction" className="flex items-center space-x-3 px-4 py-3 bg-blue-700 rounded-lg transition font-medium">
            <Zap size={20} />
            <span>Prédiction</span>
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="ml-auto">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {userName ? userName.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userName || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 md:p-12 text-white mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Prédictions</h1>
              <p className="text-blue-100 text-lg">Analysez les prédictions et les tendances</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-600 text-lg">Page de prédictions en développement...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
