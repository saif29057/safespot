from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Review
from django.contrib import admin



@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'nom', 'prenom', 'statut', 'client_type', 'user_type')
    list_filter = ('statut', 'client_type', 'user_type')

    # formulaire **édition** : on retire 'email' du fieldset par défaut
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Informations client', {
            'fields': ('email', 'nom', 'prenom', 'age', 'adresse', 'statut', 'client_type', 'user_type')
        }),
    )

    # formulaire **création**
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
        ('Informations client', {
            'fields': ('nom', 'prenom', 'age', 'adresse', 'statut', 'client_type', 'user_type')
        }),
    )

    search_fields = ('email', 'nom', 'prenom')
    ordering = ('email',)

 

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'rating', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['name', 'email', 'message']
    list_editable = ['is_approved']
    ordering = ['-created_at']

    def get_queryset(self, request):
        return super().get_queryset(request)