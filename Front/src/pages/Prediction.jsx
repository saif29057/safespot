import Header from '../components/Navbar';

export default function Prediction({ userName, onLogout }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header userName={userName} onLogout={onLogout} pageTitle="Prédiction" />

      {/* Main Content */}
      <main className="w-full">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Prédiction</h2>
          <p className="text-sm text-gray-600">Explorez nos prédictions</p>
        </div>
      </main>
    </div>
  );
}
