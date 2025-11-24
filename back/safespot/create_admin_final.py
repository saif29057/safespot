import os
import sys
import django

def setup_django():
    # Configuration de l'environnement Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safespot.settings')
    django.setup()

def create_admin():
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    
    # Vérifier si l'utilisateur existe déjà
    if User.objects.filter(username='admin').exists():
        print("[-] L'utilisateur 'admin' existe deja!")
        return
    
    try:
        # Créer un superutilisateur
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@safespot.com',
            password='admin123',
            user_type='admin',
            nom='Admin',
            prenom='Systeme',
            statut='ancien',
            client_type='fidèle'
        )
        
        print("[+] Compte administrateur créé avec succès!")
        print(f"   Nom d'utilisateur: admin")
        print(f"   Email: admin@safespot.com")
        print(f"   Mot de passe: admin123")
        
    except Exception as e:
        print(f"[-] Erreur lors de la création de l'administrateur: {e}")

if __name__ == "__main__":
    setup_django()
    create_admin()
