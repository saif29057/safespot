import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LogOut, LayoutDashboard, Users, Zap, 
  ChevronDown, User, Bell, Loader2, Home, Settings, FileText, BarChart2, HelpCircle
} from 'lucide-react';
import Notification from '../Notification';

const Sidebar = ({ isOpen, onClose, currentPath }) => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Tableau de bord', path: '/admin' },
    { icon: <Users size={20} />, label: 'Gestion Clients', path: '/admin/clients' },
    { icon: <BarChart2 size={20} />, label: 'Statistiques', path: '/admin/stats' },
    { icon: <FileText size={20} />, label: 'Rapports', path: '/admin/reports' },
    { icon: <Settings size={20} />, label: 'Paramètres', path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Navigation Sidebar Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Main Navigation Sidebar */}
      <motion.aside 
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white
          shadow-xl z-50 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-indigo-500/30">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
            SafeSpot
          </h1>
          <p className="text-sm text-indigo-200 mt-1">Espace Administration</p>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <a 
              key={item.path}
              href={item.path}
              className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentPath === item.path 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-indigo-100 hover:bg-indigo-700/50 hover:text-white'
              }`}
            >
              <span className="group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span>{item.label}</span>
              <ChevronDown size={16} className={`ml-auto transition-transform ${
                currentPath === item.path ? 'rotate-180' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </a>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-red-200/30"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

const Header = ({ onMenuToggle, userName, userRole = 'Admin' }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <Menu size={22} className="text-gray-700" />
          </button>
          <h2 className="hidden md:block text-lg font-semibold text-gray-800">Tableau de bord</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 relative">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2 ring-2 ring-white"></div>
            <Bell size={20} className="text-gray-500" />
          </button>
          
          <div ref={userMenuRef} className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">{userName || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-500 hidden md:block transition-transform duration-200 ${userMenuOpen ? 'transform rotate-180' : ''}`} 
              />
            </button>
            
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div className="py-1">
                    <a
                      href="/admin/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Mon profil</span>
                    </a>
                    <a
                      href="/admin/settings"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Paramètres</span>
                    </a>
                    <a
                      href="/help"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <HelpCircle className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Aide</span>
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        // Appeler la fonction de déconnexion passée en prop
                        if (typeof onLogout === 'function') onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

const Layout = ({ 
  children, 
  title = 'Tableau de bord',
  description = 'Gérez votre espace d\'administration',
  userName = 'Admin',
  userRole = 'Administrateur',
  onLogout = () => {},
  loading = false,
  message = null,
  onMessageClose = () => {},
  showHeader = true,
  showSidebar = true,
  currentPath = '/',
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalMessage, setInternalMessage] = useState(message);

  useEffect(() => {
    setInternalMessage(message);
  }, [message]);

  const handleMessageClose = () => {
    setInternalMessage(null);
    onMessageClose();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 ${className}`}>
      {/* Overlay de chargement */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-3" />
              <p className="text-gray-700">Chargement en cours...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre latérale */}
      {showSidebar && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onLogout={onLogout}
          currentPath={currentPath}
        />
      )}

      <div className={`flex-1 flex flex-col ${showSidebar ? 'md:pl-64' : ''}`}>
        {/* En-tête */}
        {showHeader && (
          <Header 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
            userName={userName}
            userRole={userRole}
            onLogout={onLogout}
          />
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* En-tête de page */}
            {(title || description) && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-gray-600 mt-2">{description}</p>
                )}
              </div>
            )}

            {/* Message de notification */}
            <AnimatePresence>
              {internalMessage && (
                <Notification 
                  message={internalMessage} 
                  onClose={handleMessageClose} 
                />
              )}
            </AnimatePresence>

            {/* Contenu des enfants */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
export { Header, Sidebar };
