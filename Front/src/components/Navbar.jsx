import { Home, BarChart3, Map, Navigation, LogOut } from 'lucide-react';

export default function Header({ userName, onLogout, pageTitle = 'Accueil' }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    onLogout();
  };

  const navLinks = [
    { name: 'Accueil', icon: Home, path: '/acceuil' },
    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { name: 'Prédiction', icon: Navigation, path: '/prediction' },
    { name: 'Destination', icon: Map, path: '/destination' }
  ];

  return (
    <header className="bg-gray-700 text-white border-b border-gray-600 sticky top-0 z-40">
      <div className="h-16 flex items-center px-4 sm:px-6 max-w-full">
        {/* Logo */}
        <h2 className="text-lg font-bold whitespace-nowrap">SafeSpot</h2>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-1 ml-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
                link.name === pageTitle 
                  ? 'bg-gray-600 text-white font-medium' 
                  : 'text-gray-200 hover:bg-gray-600'
              }`}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Right Side - User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* User Avatar & Name */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-600 rounded-md">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center font-medium text-xs text-gray-900">
              {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <span className="text-sm hidden sm:inline">
              {userName || 'User'}
            </span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-gray-200 hover:bg-gray-600 rounded-md transition-colors text-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
