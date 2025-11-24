import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react';
import PageLayout from '../components/Layout/PageLayout';
import useApi from '../utils/useApi';

// Données de démonstration
const demoActivities = [
  { id: 1, type: 'prediction', title: 'Prédiction effectuée', date: '2023-11-24T10:30:00', details: 'Analyse de sécurité pour Paris' },
  { id: 2, type: 'destination', title: 'Nouvelle destination ajoutée', date: '2023-11-23T15:45:00', details: 'Ajout de la ville de Lyon' },
  { id: 3, type: 'alert', title: 'Alerte météo', date: '2023-11-22T08:15:00', details: 'Alerte tempête pour la région PACA' },
];

const statsData = [
  { name: 'Prédictions', value: 24, color: '#3B82F6' },
  { name: 'Destinations', value: 12, color: '#10B981' },
  { name: 'Alertes', value: 3, color: '#EF4444' },
];

const chartData = [
  { name: 'Lun', predictions: 4, alerts: 1 },
  { name: 'Mar', predictions: 6, alerts: 0 },
  { name: 'Mer', predictions: 3, alerts: 2 },
  { name: 'Jeu', predictions: 8, alerts: 1 },
  { name: 'Ven', predictions: 5, alerts: 0 },
  { name: 'Sam', predictions: 9, alerts: 3 },
  { name: 'Dim', predictions: 7, alerts: 1 },
];

export default function Dashboard({ userName, onLogout }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setActivities(demoActivities);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'prediction':
        return <MapPin className="text-blue-500" size={18} />;
      case 'alert':
        return <AlertTriangle className="text-red-500" size={18} />;
      default:
        return <Calendar className="text-green-500" size={18} />;
    }
  };

  if (isLoading) {
    return (
      <PageLayout userName={userName} onLogout={onLogout} pageTitle="Tableau de bord">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout userName={userName} onLogout={onLogout} pageTitle="Erreur">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
          <p className="text-red-600 text-sm">{error.message || 'Impossible de charger les données du tableau de bord'}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout userName={userName} onLogout={onLogout} pageTitle="Tableau de bord">
      {/* En-tête avec bienvenue et date */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bonjour, {userName || 'Utilisateur'}</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                <div style={{ color: stat.color }}>
                  {stat.name === 'Prédictions' && <MapPin size={24} />}
                  {stat.name === 'Destinations' && <MapPin size={24} />}
                  {stat.name === 'Alertes' && <AlertTriangle size={24} />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Graphique d'activité */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="predictions" fill="#3B82F6" name="Prédictions" />
                <Bar dataKey="alerts" fill="#EF4444" name="Alertes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dernières activités */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Dernières activités</h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.details}</p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Clock size={12} className="mr-1" />
                    {new Date(activity.date).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section des destinations récentes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Vos destinations récentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['Paris', 'Lyon', 'Marseille'].map((city, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="font-medium">{city}</p>
                  <p className="text-sm text-gray-500">Dernière visite: 24/11/2023</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}