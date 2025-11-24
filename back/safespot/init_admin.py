#!/usr/bin/env python
"""
Script d'initialisation pour créer l'utilisateur admin
À exécuter: python manage.py shell
Puis: exec(open('init_admin.py').read())
"""

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'admin'
email = 'admin@safespot.com'
password = 'AdminSafeSpot123!'

# Supprimer si existe
User.objects.filter(username=username).delete()

# Créer le nouvel admin
user = User.objects.create_superuser(
    username=username,
    email=email,
    password=password,
    first_name='Admin',
    last_name='SafeSpot'
)
user.user_type = 'admin'
user.save()

print(f"✅ Admin créé avec succès!")
print(f"   Username: {user.username}")
print(f"   Email: {user.email}")
print(f"   user_type: {user.user_type}")
print(f"   Password: {password}")
