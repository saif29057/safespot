from django.contrib.auth import get_user_model

User = get_user_model()

# Créer le superuser
username = 'admin'
email = 'admin@safespot.com'
password = 'AdminSafeSpot123!'

if User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    user.user_type = 'admin'
    user.is_staff = True
    user.is_superuser = True
    user.first_name = 'Admin'
    user.last_name = 'SafeSpot'
    user.save()
    print(f"✅ Admin mis à jour!")
else:
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
        first_name='Admin',
        last_name='SafeSpot'
    )
    user.user_type = 'admin'
    user.save()
    print(f"✅ Admin créé!")

print(f"   Username: {user.username}")
print(f"   Email: {user.email}")
print(f"   user_type: {user.user_type}")
