#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safespot.settings')
sys.path.insert(0, os.path.dirname(__file__))

django.setup()

from accounts.models import User

# Mettre à jour le superuser admin
try:
    admin = User.objects.get(username='admin')
    admin.user_type = 'admin'
    admin.first_name = 'Admin'
    admin.last_name = 'SafeSpot'
    admin.save()
    print(f"✅ Admin mis à jour avec le rôle 'admin'")
    print(f"   Username: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   user_type: {admin.user_type}")
except User.DoesNotExist:
    print("❌ Utilisateur 'admin' introuvable. Créez-le d'abord.")
except Exception as e:
    print(f"❌ Erreur: {e}")
