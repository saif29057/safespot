#!/usr/bin/env python
import os
import sys
import getpass
import re
import django
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def validate_password_strength(password):
    """Valide la force du mot de passe."""
    if len(password) < 8:
        return False, "Le mot de passe doit contenir au moins 8 caractères"
    if not re.search(r'[A-Z]', password):
        return False, "Le mot de passe doit contenir au moins une majuscule"
    if not re.search(r'[a-z]', password):
        return False, "Le mot de passe doit contenir au moins une minuscule"
    if not re.search(r'[0-9]', password):
        return False, "Le mot de passe doit contenir au moins un chiffre"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Le mot de passe doit contenir au moins un caractère spécial"
    return True, ""

def get_valid_input(prompt, input_type='text', hidden=False):
    """Demande une entrée utilisateur avec validation."""
    while True:
        try:
            if hidden:
                value = getpass.getpass(prompt)
            else:
                value = input(prompt).strip()
            
            if not value:
                print("⚠️ Cette valeur est obligatoire. Veuillez réessayer.")
                continue
                
            if input_type == 'email':
                validate_email(value)
                
            return value
            
        except ValidationError:
            print("❌ Format d'email invalide. Veuillez réessayer.")
        except Exception as e:
            print(f"❌ Erreur: {str(e)}")
            sys.exit(1)

def main():
    print("\n=== Création d'un superutilisateur SafeSpot ===\n")
    
    # Configuration de Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safespot.settings')
    try:
        django.setup()
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation de Django: {e}")
        sys.exit(1)

    from accounts.models import User

    # Saisie des informations
    print("Veuillez entrer les informations du superutilisateur :")
    username = get_valid_input("Nom d'utilisateur : ")
    email = get_valid_input("Email : ", input_type='email')
    
    while True:
        password = get_valid_input("Mot de passe : ", hidden=True)
        password_confirm = get_valid_input("Confirmez le mot de passe : ", hidden=True)
        
        if password != password_confirm:
            print("❌ Les mots de passe ne correspondent pas. Veuillez réessayer.")
            continue
            
        is_valid, message = validate_password_strength(password)
        if not is_valid:
            print(f"❌ {message}")
            continue
            
        break

    # Création du superutilisateur
    try:
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            print(f"\n❌ Un utilisateur avec ce nom d'utilisateur ou cet email existe déjà!")
            sys.exit(1)
            
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            user_type='admin',  # Champ requis pour le modèle User personnalisé
            nom='Admin',        # Champ requis
            prenom='Admin',     # Champ requis
            adresse='',         # Champ requis mais peut être vide
            statut='ancien',    # Valeur par défaut
            client_type='fidele' # Valeur par défaut
        )
        print("\n✅ Superuser créé avec succès!")
        print(f"   Nom d'utilisateur: {username}")
        print(f"   Email: {email}")
        print("\n⚠️  Conservez ces informations dans un endroit sécurisé!")
        
    except Exception as e:
        print(f"\n❌ Erreur lors de la création du superutilisateur: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
