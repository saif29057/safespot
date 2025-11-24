import sqlite3
import hashlib
from datetime import datetime

# Connexion à la base de données
db_path = r'C:\Users\arijk\SafeSpot\back\safespot\db.sqlite3'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Données du superuser
username = 'admin'
email = 'admin@safespot.com'
password = 'AdminSafeSpot123!'

# Créer le hash du mot de passe (format Django)
# Django utilise PBKDF2 par défaut
from django.contrib.auth.hashers import make_password

# On va créer via une méthode manuelle pour éviter les imports Django
# Utiliser pbkdf2_sha256 comme Django
import hashlib
import os

def make_django_password(password):
    """Crée un hash de mot de passe compatible Django"""
    algorithm = 'pbkdf2_sha256'
    iterations = 390000
    salt = os.urandom(32).hex()
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), iterations)
    return f'{algorithm}${iterations}${salt}${hash_obj.hex()}'

hashed_password = make_django_password(password)

# Vérifier si l'utilisateur existe
cursor.execute('SELECT id FROM auth_user WHERE username = ?', (username,))
if cursor.fetchone():
    print(f"❌ Le superuser '{username}' existe déjà!")
else:
    try:
        # Insérer le superuser
        now = datetime.now().isoformat()
        cursor.execute('''
            INSERT INTO auth_user 
            (username, first_name, last_name, email, password, is_staff, is_active, is_superuser, last_login, date_joined)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (username, '', '', email, hashed_password, 1, 1, 1, None, now))
        
        conn.commit()
        print(f"✅ Superuser créé avec succès!")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"\nℹ️  Accédez à: http://localhost:8000/admin/")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    finally:
        conn.close()
