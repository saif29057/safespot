import { useState, useEffect } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { apiPost } from './utils/api';

export default function SafeSpotLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      onLogin(localStorage.getItem('userName') || 'Utilisateur', localStorage.getItem('userRole') || 'client');
    }
  }, [onLogin]);

  const handleLogin = async () => {
    setError('');

    // Validation des champs
    if (!email.trim()) return setError("Veuillez entrer votre adresse email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Adresse email invalide");
    if (!password) return setError("Veuillez entrer votre mot de passe");

    setIsLoading(true);

    try {
      console.log("Tentative de connexion avec l'email:", email);
      
      // Appel API avec gestion d'erreur détaillée
      const data = await apiPost("login/", { email, password })
        .catch(error => {
          console.error("Erreur lors de l'appel API:", error);
          if (error.response) {
            // La requête a été faite et le serveur a répondu avec un statut hors 2xx
            console.error("Réponse d'erreur du serveur:", error.response.data);
            console.error("Statut de la réponse:", error.response.status);
            console.error("En-têtes de la réponse:", error.response.headers);
            
            // Si le serveur renvoie des détails d'erreur, les utiliser
            if (error.response.data && error.response.data.detail) {
              throw new Error(error.response.data.detail);
            }
          } else if (error.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            console.error("Aucune réponse reçue du serveur");
            throw new Error("Le serveur ne répond pas. Veuillez vérifier votre connexion.");
          } else {
            // Une erreur s'est produite lors de la configuration de la requête
            console.error("Erreur lors de la configuration de la requête:", error.message);
            throw new Error("Erreur lors de la configuration de la requête.");
          }
          throw error; // Relancer l'erreur pour la gestion ultérieure
        });

      console.log("Réponse de l'API:", data);

      // Vérification des données reçues
      if (!data.token) {
        console.error("Aucun token reçu dans la réponse:", data);
        throw new Error("Réponse du serveur invalide: aucun token reçu");
      }

      // Stockage des informations d'authentification
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh_token", data.refresh_token || '');
      localStorage.setItem("userRole", data.user_role || "client");
      localStorage.setItem("userName", data.user_name || email.split("@")[0]);

      console.log("Connexion réussie, redirection...");
      onLogin(data.user_name || email.split("@")[0], data.user_role || "client");
      
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          setError("Email ou mot de passe incorrect");
        } else if (status === 403) {
          setError("Accès refusé. Votre compte est peut-être désactivé.");
        } else if (status >= 500) {
          setError("Erreur serveur. Veuillez réessayer plus tard.");
        } else if (data && data.message) {
          setError(data.message);
        } else {
          setError(`Erreur inattendue (${status}). Veuillez réessayer.`);
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Une erreur inconnue s'est produite. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");

    if (!resetEmail.trim()) return setError("Veuillez entrer votre adresse email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) return setError("Adresse email invalide");

    setIsLoading(true);

    try {
      await apiPost("password-reset/", { email: resetEmail });
      setResetSuccess(true);
    } catch {
      setResetSuccess(true); // On ne révèle rien pour sécurité
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      showForgotPassword ? handleForgotPassword() : handleLogin();
    }
  };

  /* ------------------------------ MOT DE PASSE OUBLIÉ ------------------------------ */
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 grid place-content-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SafeSpot</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetSuccess(false);
                setResetEmail("");
              }}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la connexion
            </button>

            {!resetSuccess ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Mot de passe oublié</h2>
                <p className="text-gray-600 mb-6">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex justify-center items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer le lien"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold mb-2">Email envoyé !</h3>
                <p className="text-gray-600 mb-6">
                  Un lien de réinitialisation a été envoyé à <strong>{resetEmail}</strong>
                </p>

                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSuccess(false);
                    setResetEmail("");
                  }}
                  className="text-blue-600 font-medium"
                >
                  Retour à la connexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------ PAGE LOGIN ------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {/* Affichage des informations de débogage en mode développement */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative text-xs overflow-x-auto" role="alert">
              <pre className="whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          )}
          <h1 className="text-3xl font-bold">SafeSpot</h1>
          <p className="text-gray-600">Votre Assurance Inteligente</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Connexion</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="flex justify-end mt-1">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            &copy; 2025 SafeSpot. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
