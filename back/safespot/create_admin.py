import sqlite3
from datetime import datetime
import hashlib
import os

def make_django_password(password):
    """Crée un hash de mot de passe compatible Django"""
    algorithm = 'pbkdf2_sha256'
    iterations = 390000
    salt = os.urandom(32).hex()
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), iterations)
    return f'{algorithm}${iterations}${salt}${hash_obj.hex()}'

def create_admin():
    # Chemin vers la base de données
    db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
    
    # Informations de l'administrateur
    username = 'admin'
    email = 'admin@safespot.com'
    password = 'admin123'  # Mot de passe en clair qui sera hashé
    
    # Connexion à la base de données
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Vérifier si l'utilisateur existe déjà
    cursor.execute('SELECT id FROM auth_user WHERE username = ?', (username,))
    if cursor.fetchone():
        print(f"❌ L'utilisateur '{username}' existe déjà!")
        return
    
    # Créer le hash du mot de passe
    hashed_password = make_django_password(password)
    
    # Date actuelle au format attendu par Django
    now = datetime.now().isoformat()
    
    try:
        # Insérer le nouvel utilisateur administrateur
        cursor.execute('''
            INSERT INTO auth_user 
            (password, is_superuser, username, first_name, last_name, email, 
             is_staff, is_active, date_joined, user_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            hashed_password,  # password
            1,                # is_superuser
            username,         # username
            '',               # first_name
            '',               # last_name
            email,            # email
            1,                # is_staff
            1,                # is_active
            now,              # date_joined
            'admin'           # user_type (champ personnalisé)
        ))
        
        # Valider les changements
        conn.commit()
        print("✅ Compte administrateur créé avec succès!")
        print(f"   Nom d'utilisateur: {username}")
        print(f"   Email: {email}")
        print(f"   Mot de passe: {password}")
        
    except sqlite3.Error as e:
        print(f"❌ Erreur lors de la création de l'administrateur: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    create_admin()
