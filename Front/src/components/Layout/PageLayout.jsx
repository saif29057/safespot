import PropTypes from 'prop-types';
import Header from '../Navbar';
import { useState, useEffect } from 'react';

const PageLayout = ({ children, userName, onLogout, pageTitle, showHeader = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-4">{error.message || 'Veuillez réessayer plus tard.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header userName={userName} onLogout={onLogout} pageTitle={pageTitle} />}
      
      <main className="w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  userName: PropTypes.string,
  onLogout: PropTypes.func,
  pageTitle: PropTypes.string,
  showHeader: PropTypes.bool
};

export default PageLayout;
