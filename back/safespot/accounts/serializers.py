from rest_framework import serializers
from .models import Review, User  # ✅ ton User personnalisé, pas celui de django.contrib.auth

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'name', 'email', 'rating', 'message', 'is_approved', 'created_at']
        read_only_fields = ['id', 'is_approved', 'created_at']  # ✅ empêcher la modification manuelle du statut

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("La note doit être entre 1 et 5.")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("L'email est obligatoire.")
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'nom', 'prenom', 'age',
            'adresse', 'statut', 'client_type', 'user_type'
        ]
        read_only_fields = ['id', 'user_type']  # ✅ pour éviter les modifications directes du rôle


class ClientSerializer(serializers.ModelSerializer):
    """Serializer for creating and managing client accounts"""
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'nom', 'prenom', 'age', 'adresse', 
            'statut', 'client_type', 'password', 'username'
        ]
        read_only_fields = ['id']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        email = validated_data.get('email')
        
        # Use email as username if not provided
        validated_data['username'] = validated_data.pop('username', email)
        
        # Create user with user_type='client'
        user = User.objects.create_user(
            user_type='client',
            **validated_data
        )
        
        # Set password if provided
        if password:
            user.set_password(password)
            user.save()
        
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update password if provided
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
