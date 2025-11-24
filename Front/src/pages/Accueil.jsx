import { useState, useEffect } from 'react';
import { Search, MapPin, Shield, Bell, BarChart2, ArrowRight, Check, Users, Globe, Award, MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/Layout/PageLayout';

// Données de démonstration
const features = [
  {
    icon: <Shield className="h-8 w-8 text-blue-500" />,
    title: 'Sécurité en temps réel',
    description: 'Obtenez des alertes en temps réel sur les risques de sécurité dans votre zone.'
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-green-500" />,
    title: 'Analyses avancées',
    description: 'Accédez à des analyses détaillées pour prendre des décisions éclairées.'
  },
  {
    icon: <Bell className="h-8 w-8 text-purple-500" />,
    title: 'Alertes personnalisées',
    description: 'Recevez des notifications personnalisées en fonction de vos destinations.'
  }
];

const testimonials = [
  {
    name: 'Jean Dupont',
    role: 'Voyageur fréquent',
    content: 'SafeSpot a révolutionné ma façon de voyager. Je me sens beaucoup plus en sécurité en sachant que je peux compter sur des informations fiables en temps réel.',
    avatar: 'JD'
  },
  {
    name: 'Marie Martin',
    role: 'Professionnelle',
    content: 'En tant que femme voyageant souvent seule pour le travail, SafeSpot est devenu un outil indispensable pour planifier mes déplacements en toute sécurité.',
    avatar: 'MM'
  }
];

export default function HomePage({ userName, onLogout }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [stats, setStats] = useState([
    { value: '500+', label: 'Destinations couvertes', icon: <Globe className="h-6 w-6 text-blue-500" /> },
    { value: '10K+', label: 'Utilisateurs actifs', icon: <Users className="h-6 w-6 text-green-500" /> },
    { value: '95%', label: 'Taux de satisfaction', icon: <Award className="h-6 w-6 text-purple-500" /> }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un envoi de formulaire
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Formulaire soumis:', formData);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout userName={userName} onLogout={onLogout} pageTitle="Accueil">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Voyagez en toute</span>
                  <span className="block text-blue-200">sérénité</span>
                </h1>
                <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  SafeSpot vous fournit des informations en temps réel sur la sécurité et les conditions météorologiques pour vos déplacements.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start
                ">
                  <div className="rounded-md shadow">
                    <Link
                      to="/prediction"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                    >
                      Essayer maintenant
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                    >
                      Tableau de bord
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une meilleure façon de voyager en toute sécurité
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Découvrez comment SafeSpot peut vous aider à planifier vos déplacements en toute confiance.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Faites-nous confiance
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Rejoignez des milliers d'utilisateurs satisfaits à travers le monde
            </p>
          </div>
        </div>
        <div className="mt-10 pb-12 bg-white sm:pb-16">
          <div className="relative
          ">
            <div className="absolute inset-0 h-1/2 bg-gray-50" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                      <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        {stat.label}
                      </dt>
                      <dd className="order-1 text-5xl font-extrabold text-blue-600">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white pt-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Témoignages</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Ce que disent nos utilisateurs
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Prêt à commencer?</span>
            <span className="block text-blue-200">Créez votre compte dès aujourd'hui.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Rejoignez des milliers d'utilisateurs qui font déjà confiance à SafeSpot pour leurs déplacements.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            S'inscrire maintenant
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
        <div className="relative max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Contactez-nous
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-500">
              Une question? Notre équipe est là pour vous aider.
            </p>
          </div>
          <div className="mt-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      Envoyer le message
                      <MessageSquare className="ml-3 -mr-1 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
              {submitSuccess && (
                <div className="sm:col-span-2">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Votre message a été envoyé avec succès. Nous vous répondrons dès que possible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}