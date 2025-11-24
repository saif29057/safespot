import { useState, useEffect } from 'react';
import { 
  Trash2, Edit, Plus, Search, Mail, Lock, 
  Eye, EyeOff, Check, AlertTriangle, Info, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { Layout } from '../components';

export default function AdminClients({ userName, onLogout }) {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    nom: '', 
    prenom: '', 
    email: '', 
    age: '', 
    adresse: '', 
    password: '', 
    statut: 'nouveau', 
    client_type: 'fidele' 
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await apiGet('clients/');
      setClients(data.results || data || []);
      setMessage('');
    } catch (error) {
      console.error('Error loading clients:', error);
      setMessage({ type: 'error', text: 'Erreur lors du chargement des clients' });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    `${client.nom} ${client.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddClient = async () => {
    // Validation des champs
    if (!formData.nom || !formData.prenom || !formData.email || (!editingId && !formData.password)) {
      setMessage({ 
        type: 'error', 
        text: 'Veuillez remplir tous les champs obligatoires' 
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage({ 
        type: 'error', 
        text: 'Veuillez entrer une adresse email valide' 
      });
      return;
    }

    try {
      setFormSubmitting(true);
      
      const clientData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        age: formData.age ? parseInt(formData.age) : null,
        adresse: formData.adresse.trim(),
        statut: formData.statut,
        client_type: formData.client_type,
        username: formData.email.trim()
      };

      // Ne pas envoyer le mot de passe s'il est vide (cas de la modification)
      if (formData.password) {
        clientData.password = formData.password;
      }

      if (editingId) {
        await apiPut(`clients/${editingId}/`, clientData);
        setMessage({ 
          type: 'success', 
          text: 'Client modifié avec succès' 
        });
      } else {
        await apiPost('clients/', clientData);
        setMessage({ 
          type: 'success', 
          text: 'Client créé avec succès !' 
        });
      }

      // Recharger la liste
      await loadClients();
      
      // Réinitialiser le formulaire
      setFormData({ 
        nom: '', 
        prenom: '', 
        email: '', 
        age: '', 
        adresse: '', 
        password: '', 
        statut: 'nouveau', 
        client_type: 'fidele' 
      });
      
      setEditingId(null);
      setShowForm(false);
      setShowPassword(false);
      
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde' 
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      age: client.age || '',
      adresse: client.adresse,
      password: '',
      statut: client.statut,
      client_type: client.client_type
    });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
      try {
        setLoading(true);
        await apiDelete(`clients/${id}/`);
        setMessage({ 
          type: 'success', 
          text: 'Client supprimé avec succès' 
        });
        await loadClients();
      } catch (error) {
        console.error('Error:', error);
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Erreur lors de la suppression du client' 
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Fermer automatiquement les messages après 5 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Layout
      title="Gestion des Clients"
      description="Créez et gérez les comptes clients avec email et mot de passe"
      userName={userName}
      onLogout={onLogout}
      loading={loading || formSubmitting}
      message={message}
      onMessageClose={() => setMessage('')}
      currentPath="/admin/clients"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* En-tête avec bouton d'ajout */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({ 
                  nom: '', 
                  prenom: '', 
                  email: '', 
                  age: '', 
                  adresse: '', 
                  password: '', 
                  statut: 'nouveau', 
                  client_type: 'fidele' 
                });
                setShowPassword(false);
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} />
              <span>Nouveau Client</span>
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingId ? 'Modifier le Client' : 'Créer un Nouveau Client'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom*</label>
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom*</label>
                    <input
                      type="text"
                      placeholder="Nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
                    <input
                      type="number"
                      placeholder="Âge"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Adresse */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                    <input
                      type="text"
                      placeholder="Adresse"
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="ancien">Ancien</option>
                    </select>
                  </div>

                  {/* Type Client */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de Client</label>
                    <select
                      value={formData.client_type}
                      onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="fidele">Fidèle</option>
                      <option value="a_risque">À risque</option>
                    </select>
                  </div>

                  {/* Mot de passe */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe {!editingId && '*'}</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mot de passe"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={formSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleAddClient}
                      disabled={formSubmitting}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          {editingId ? 'Mise à jour...' : 'Création...'}
                        </>
                      ) : (
                        <>{editingId ? 'Mettre à jour' : 'Ajouter le client'}</>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ nom: '', prenom: '', email: '', age: '', adresse: '', password: '', statut: 'nouveau', client_type: 'fidele' });
                      setShowPassword(false);
                    }}
                    className="flex-1 bg-gray-300 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

          {/* Search Bar */}
          <div className="pt-2">
              <div className="flex items-center space-x-3 bg-white border border-gray-300 rounded-lg px-4 py-3">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                />
              </div>
            </div>

          {/* Clients Table */}
          {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
                <p>Chargement des clients...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prénom</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Âge</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.prenom}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.nom}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail size={16} className="text-gray-400" />
                            <span>{client.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{client.age || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            client.statut === 'nouveau' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {client.statut === 'nouveau' ? 'Nouveau' : 'Ancien'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {client.client_type === 'fidele' ? 'Fidèle' : 'À risque'}
                        </td>
                        <td className="px-6 py-4 flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredClients.length === 0 && !loading && (
                  <div className="p-8 text-center text-gray-500">
                    <p>Aucun client trouvé</p>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
}
