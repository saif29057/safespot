import os
import django

def setup_django():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safespot.settings')
    django.setup()

def list_users():
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    
    print("Utilisateurs existants :")
    print("-" * 50)
    
    for user in User.objects.all():
        print(f"ID: {user.id}")
        print(f"Nom d'utilisateur: {user.username}")
        print(f"Email: {user.email}")
        print(f"Prénom: {user.prenom}")
        print(f"Nom: {user.nom}")
        print(f"Type d'utilisateur: {user.user_type}")
        print(f"Est administrateur: {user.is_superuser}")
        print("-" * 50)

if __name__ == "__main__":
    setup_django()
    list_users()
