import { useState, useEffect } from 'react';
import { Search, MapPin, Droplet, Wind, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, SunDim, CloudFog } from 'lucide-react';
import PageLayout from '../components/Layout/PageLayout';

// Données de démonstration pour les prévisions
const demoWeatherData = {
  city: 'Paris, FR',
  current: {
    temp: 18,
    feels_like: 17,
    humidity: 65,
    wind_speed: 12,
    description: 'Nuageux',
    icon: 'cloudy',
  },
  forecast: [
    { day: 'Lun', temp: 18, icon: 'cloudy' },
    { day: 'Mar', temp: 20, icon: 'partly-cloudy' },
    { day: 'Mer', temp: 22, icon: 'sunny' },
    { day: 'Jeu', temp: 19, icon: 'rain' },
    { day: 'Ven', temp: 17, icon: 'cloudy' },
  ]
};

const weatherIcons = {
  sunny: <Sun className="text-yellow-400" size={32} />,
  cloudy: <Cloud className="text-gray-400" size={32} />,
  'partly-cloudy': <SunDim className="text-yellow-300" size={32} />,
  rain: <CloudRain className="text-blue-400" size={32} />,
  snow: <CloudSnow className="text-blue-200" size={32} />,
  thunderstorm: <CloudLightning className="text-purple-500" size={32} />,
  fog: <CloudFog className="text-gray-300" size={32} />,
};

export default function Meteo({ userName, onLogout }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simuler un appel API
    const timer = setTimeout(() => {
      try {
        setWeatherData(demoWeatherData);
        setLoading(false);
      } catch (err) {
        setError('Impossible de charger les données météo');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // Simuler une recherche
    setTimeout(() => {
      setWeatherData({
        ...demoWeatherData,
        city: `${searchQuery}, FR`,
        current: {
          ...demoWeatherData.current,
          temp: Math.floor(Math.random() * 10) + 15, // Température aléatoire entre 15 et 25
        }
      });
      setLoading(false);
    }, 800);
  };

  const getWeatherIcon = (iconName) => {
    return weatherIcons[iconName] || weatherIcons.cloudy;
  };

  if (loading) {
    return (
      <PageLayout userName={userName} onLogout={onLogout} pageTitle="Météo">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout userName={userName} onLogout={onLogout} pageTitle="Erreur Météo">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Erreur</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout userName={userName} onLogout={onLogout} pageTitle="Météo">
      <div className="max-w-4xl mx-auto">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rechercher une ville..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Carte météo actuelle */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl shadow-lg p-6 text-white mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <MapPin className="mr-2" size={20} />
                {weatherData.city}
              </h2>
              <p className="text-blue-100">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{weatherData.current.temp}°C</div>
              <p className="text-blue-100">{weatherData.current.description}</p>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="text-8xl">
              {getWeatherIcon(weatherData.current.icon)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-400/20 p-3 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <Droplet size={20} />
                <span>Humidité</span>
              </div>
              <div className="font-bold">{weatherData.current.humidity}%</div>
            </div>
            <div className="bg-blue-400/20 p-3 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <Wind size={20} />
                <span>Vent</span>
              </div>
              <div className="font-bold">{weatherData.current.wind_speed} km/h</div>
            </div>
          </div>
        </div>

        {/* Prévisions sur 5 jours */}
        <h3 className="text-lg font-semibold mb-4">Prévisions sur 5 jours</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
              <p className="font-medium text-gray-900">{day.day}</p>
              <div className="my-2 flex justify-center">
                {getWeatherIcon(day.icon)}
              </div>
              <p className="text-gray-700 font-semibold">{day.temp}°C</p>
            </div>
          ))}
        </div>

        {/* Conseils de sécurité */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Conseil de sécurité</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Prévisions de pluie demain. Pensez à prendre un parapluie et à adapter votre itinéraire si nécessaire.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}