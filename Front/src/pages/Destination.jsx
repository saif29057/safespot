import { useState } from 'react';
import { Search, MapPin, Map } from 'lucide-react';
import Header from '../components/Navbar';

export default function Destination({ userName, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);

  const tunisianDestinations = [
    { id: 1, name: 'Tunis', region: 'Grand Tunis', description: 'Capitale de la Tunisie', color: 'bg-blue-100 text-blue-700' },
    { id: 2, name: 'Sousse', region: 'Sahel', description: 'Destination balnéaire populaire', color: 'bg-green-100 text-green-700' },
    { id: 3, name: 'Djerba', region: 'Médenine', description: 'Île touristique renommée', color: 'bg-purple-100 text-purple-700' },
    { id: 4, name: 'Sfax', region: 'Sfax', description: 'Centre économique de la Tunisie', color: 'bg-orange-100 text-orange-700' },
    { id: 5, name: 'Kairouan', region: 'Kairouan', description: 'Ville sainte musulmane', color: 'bg-pink-100 text-pink-700' },
    { id: 6, name: 'Gafsa', region: 'Gafsa', description: 'Région minière du sud', color: 'bg-red-100 text-red-700' },
    { id: 7, name: 'Tataouine', region: 'Tataouine', description: 'Porte du Sahara', color: 'bg-yellow-100 text-yellow-700' },
    { id: 8, name: 'Tozeur', region: 'Tozeur', description: 'Oasis du désert', color: 'bg-amber-100 text-amber-700' },
    { id: 9, name: 'Gabès', region: 'Gabès', description: 'Ville côtière du sud', color: 'bg-cyan-100 text-cyan-700' },
    { id: 10, name: 'Hammamet', region: 'Nabeul', description: 'Station balnéaire réputée', color: 'bg-indigo-100 text-indigo-700' },
    { id: 11, name: 'Kerkennah', region: 'Sfax', description: 'Archipel de Sfax', color: 'bg-teal-100 text-teal-700' },
    { id: 12, name: 'Mahdia', region: 'Mahdia', description: 'Port historique', color: 'bg-rose-100 text-rose-700' },
  ];

  const filteredDestinations = tunisianDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header userName={userName} onLogout={onLogout} pageTitle="Destination" />

      {/* Main Content */}
      <div className="w-full lg:flex lg:overflow-hidden">
        {/* Destinations Sidebar */}
        <aside className="w-full lg:w-72 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
              <Search className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Destinations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredDestinations.length > 0 ? (
              <div className="space-y-2 p-4">
                {filteredDestinations.map(destination => (
                  <button
                    key={destination.id}
                    onClick={() => setSelectedDestination(destination)}
                    className={`
                      w-full text-left p-4 rounded-lg transition
                      ${selectedDestination?.id === destination.id 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <MapPin size={18} className="flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{destination.name}</h4>
                        <p className={`text-xs mt-1 truncate ${selectedDestination?.id === destination.id ? 'text-blue-100' : 'text-gray-600'}`}>
                          {destination.region}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">Aucune destination trouvée</p>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {selectedDestination ? (
            <div className="max-w-5xl mx-auto">
              {/* Destination Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{selectedDestination.name}</h1>
                <p className="text-blue-100 text-lg">{selectedDestination.region}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Description */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">À propos</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedDestination.description}
                  </p>
                </div>

                {/* Features */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Caractéristiques</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">Sécurisée</p>
                        <p className="text-xs text-gray-600">Évaluation optimale</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">Infrastructures</p>
                        <p className="text-xs text-gray-600">Services de qualité</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">Touristique</p>
                        <p className="text-xs text-gray-600">Disponibilité complète</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                  <p className="text-3xl font-bold text-blue-600">95%</p>
                  <p className="text-xs text-gray-600 mt-2">Sécurité</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                  <p className="text-3xl font-bold text-green-600">4.8★</p>
                  <p className="text-xs text-gray-600 mt-2">Évaluation</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-200">
                  <p className="text-3xl font-bold text-purple-600">12K+</p>
                  <p className="text-xs text-gray-600 mt-2">Visiteurs</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <Map size={72} className="text-gray-300 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sélectionnez une destination</h2>
                <p className="text-gray-600">Choisissez une destination à gauche pour voir les détails</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}