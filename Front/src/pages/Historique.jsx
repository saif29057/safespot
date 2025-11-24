import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, AlertTriangle, Clock, ChevronDown, ChevronUp, Download } from 'lucide-react';
import PageLayout from '../components/Layout/PageLayout';

// Données de démonstration pour l'historique
const demoHistoryData = [
  {
    id: 1,
    date: '2023-11-24T14:30:00',
    location: 'Paris, France',
    type: 'Sécurité',
    status: 'Sûr',
    statusColor: 'bg-green-100 text-green-800',
    details: 'Niveau de sécurité élevé dans la zone',
    riskFactors: ['Faible criminalité', 'Bon éclairage', 'Présence policière']
  },
  {
    id: 2,
    date: '2023-11-23T18:15:00',
    location: 'Marseille, France',
    type: 'Météo',
    status: 'Risque modéré',
    statusColor: 'bg-yellow-100 text-yellow-800',
    details: 'Prévisions de pluie et de vent fort',
    riskFactors: ['Vent fort', 'Visibilité réduite']
  },
  {
    id: 3,
    date: '2023-11-22T09:45:00',
    location: 'Lyon, France',
    type: 'Sécurité',
    status: 'Risque élevé',
    statusColor: 'bg-red-100 text-red-800',
    details: 'Zone à éviter en soirée',
    riskFactors: ['Activité criminelle signalée', 'Éclairage insuffisant']
  },
  {
    id: 4,
    date: '2023-11-21T16:20:00',
    location: 'Toulouse, France',
    type: 'Météo',
    status: 'Sûr',
    statusColor: 'bg-green-100 text-green-800',
    details: 'Conditions météorologiques favorables',
    riskFactors: ['Temps clair', 'Visibilité excellente']
  },
  {
    id: 5,
    date: '2023-11-20T20:00:00',
    location: 'Nice, France',
    type: 'Sécurité',
    status: 'Sûr',
    statusColor: 'bg-green-100 text-green-800',
    details: 'Zone touristique sûre',
    riskFactors: ['Forte présence touristique', 'Éclairage adéquat']
  }
];

export default function Historique({ userName, onLogout }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'Tous',
    status: 'Tous',
    dateRange: '30days'
  });
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setHistory(demoHistoryData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'Tous' || item.type === filters.type;
    const matchesStatus = filters.status === 'Tous' || item.status === filters.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportToCSV = () => {
    // Simuler l'exportation en CSV
    const headers = ['Date', 'Lieu', 'Type', 'Statut', 'Détails'];
    const csvContent = [
      headers.join(','),
      ...filteredHistory.map(item => [
        new Date(item.date).toLocaleString(),
        `"${item.location}"`,
        item.type,
        item.status,
        `"${item.details}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historique-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <PageLayout userName={userName} onLogout={onLogout} pageTitle="Historique">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout userName={userName} onLogout={onLogout} pageTitle="Historique des prédictions">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec recherche et filtres */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Historique des prédictions</h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher par lieu ou détails..."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Tous">Tous les types</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Météo">Météo</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Tous">Tous les statuts</option>
                  <option value="Sûr">Sûr</option>
                  <option value="Risque modéré">Risque modéré</option>
                  <option value="Risque élevé">Risque élevé</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Liste des prédictions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <li key={item.id} className="hover:bg-gray-50">
                  <div 
                    className="px-4 py-4 sm:px-6 cursor-pointer"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            {item.type === 'Sécurité' ? (
                              <MapPin className="h-8 w-8 text-blue-500" />
                            ) : (
                              <CloudRain className="h-8 w-8 text-blue-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 px-4">
                            <div>
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {item.location}
                              </p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {new Date(item.date).toLocaleString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.statusColor}`}>
                          {item.status}
                        </p>
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {expandedItems[item.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedItems[item.id] && (
                      <div className="mt-4 pl-12 pr-4">
                        <div className="text-sm text-gray-700 mb-3">
                          <p className="font-medium">Détails :</p>
                          <p className="mt-1">{item.details}</p>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Facteurs de risque :</p>
                          <div className="flex flex-wrap gap-2">
                            {item.riskFactors.map((factor, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Voir sur la carte
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune prédiction trouvée</h3>
                  <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos filtres de recherche.</p>
                </div>
              </li>
            )}
          </ul>
        </div>
        
        {/* Pagination */}
        {filteredHistory.length > 0 && (
          <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4" aria-label="Pagination">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredHistory.length}</span> sur{' '}
                <span className="font-medium">{filteredHistory.length}</span> résultats
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                disabled
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                disabled
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </nav>
        )}
      </div>
    </PageLayout>
  );
}