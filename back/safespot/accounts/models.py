# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    # rôles globaux
    USER_TYPES = (('admin', 'Admin'), ('client', 'Client'))
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='client')

    # données métier « client »
    nom = models.CharField(max_length=50, blank=True)
    prenom = models.CharField(max_length=50, blank=True)
    age = models.PositiveSmallIntegerField(blank=True, null=True)
    adresse = models.TextField(blank=True)
    statut = models.CharField(max_length=10, choices=[('nouveau', 'Nouveau'), ('ancien', 'Ancien')], default='nouveau')
    client_type = models.CharField(max_length=10, choices=[('fidele', 'Fidèle'), ('a_risque', 'À risque')], default='fidele')

    # évite les clashes avec auth.User
    groups = models.ManyToManyField(Group, blank=True, related_name='custom_user_set', related_query_name='custom_user')
    user_permissions = models.ManyToManyField(Permission, blank=True, related_name='custom_user_set', related_query_name='custom_user')

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.email})"


# Review doit être **en dehors** de User
class Review(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.rating}/5)"
