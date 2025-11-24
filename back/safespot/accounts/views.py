import logging
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Avg
from .models import Review
from .serializers import ReviewSerializer, UserSerializer, ClientSerializer

# Configuration du logger
logger = logging.getLogger(__name__)

User = get_user_model()


# Custom Permission for Admin
class IsAdmin(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'admin'

# Login API
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '').strip()
    
    logger.info(f"Tentative de connexion pour l'email: {email}")
    
    # Validation des entrées
    if not email or not password:
        logger.warning("Tentative de connexion sans email ou mot de passe")
        return Response({
            'success': False,
            'message': 'L\'email et le mot de passe sont requis',
            'error_code': 'MISSING_CREDENTIALS'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validation de l'email
    if not '@' in email or '.' not in email.split('@')[1]:
        logger.warning(f"Format d'email invalide: {email}")
        return Response({
            'success': False,
            'message': 'Veuillez fournir une adresse email valide',
            'error_code': 'INVALID_EMAIL'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Vérification de l'existence de l'utilisateur
        try:
            user = User.objects.get(email=email)
            logger.info(f"Utilisateur trouvé: {user.username} (ID: {user.id})")
        except User.DoesNotExist:
            logger.warning(f"Aucun utilisateur trouvé avec l'email: {email}")
            # Ne pas révéler que l'email n'existe pas pour des raisons de sécurité
            return Response({
                'success': False,
                'message': 'Email ou mot de passe incorrect',
                'error_code': 'INVALID_CREDENTIALS'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Vérification du mot de passe avec l'email comme username
        user = authenticate(request, username=email, password=password)
        logger.info(f"Résultat de l'authentification: {user is not None}")
        
        if not user:
            logger.warning(f"Échec de l'authentification pour l'utilisateur {email}")
            return Response({
                'success': False,
                'message': 'Email ou mot de passe incorrect',
                'error_code': 'INVALID_CREDENTIALS'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Vérification si le compte est actif
        if not user.is_active:
            logger.warning(f"Tentative de connexion à un compte désactivé: {email}")
            return Response({
                'success': False,
                'message': 'Ce compte est désactivé. Veuillez contacter l\'administrateur.',
                'error_code': 'ACCOUNT_DISABLED'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Génération des tokens
        refresh = RefreshToken.for_user(user)
        
        # Récupération du nom complet
        full_name = f"{user.prenom} {user.nom}".strip() if user.prenom and user.nom else user.username
        
        logger.info(f"Connexion réussie pour l'utilisateur: {user.email} (ID: {user.id})")
        
        return Response({
            'success': True,
            'user_id': user.id,
            'user_name': full_name,
            'email': user.email,
            'user_role': user.user_type,
            'token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'expires_in': 3600  # 1 heure en secondes
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        # Log l'erreur pour le débogage
        logger.error(f"Erreur lors de la tentative de connexion: {str(e)}", exc_info=True)
        return Response({
            'success': False,
            'message': 'Une erreur est survenue lors de la connexion',
            'error_code': 'SERVER_ERROR',
            'detail': str(e) if str(e) else 'Erreur inconnue'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Password Reset
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_view(request):
    email = request.data.get('email')
    
    if not email:
        return Response({
            'success': False,
            'message': 'Email requis'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        # TODO: envoyer un email avec un lien de réinitialisation
        return Response({
            'success': True,
            'message': 'Email de réinitialisation envoyé'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': True,
            'message': 'Si cet email existe, un lien de réinitialisation a été envoyé'
        }, status=status.HTTP_200_OK)

# Review ViewSet
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_approved=True)
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'success': True,
            'message': 'Merci pour votre avis ! Il sera publié après validation.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

# Get User Profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response({
        'success': True,
        'user': serializer.data
    }, status=status.HTTP_200_OK)

# Get Statistics for About Section
@api_view(['GET'])
@permission_classes([AllowAny])
def get_statistics(request):
    stats = {
        'destinations': 500,
        'users': User.objects.count(),
        'satisfaction': 95,
        'total_reviews': Review.objects.filter(is_approved=True).count(),
        'average_rating': Review.objects.filter(is_approved=True).aggregate(
            avg_rating=Avg('rating')
        )['avg_rating'] or 0
    }
    return Response({
        'success': True,
        'statistics': stats
    }, status=status.HTTP_200_OK)


# Client Management ViewSet (Admin only)
class ClientViewSet(viewsets.ModelViewSet):
    """API endpoints for managing client accounts (admin only)"""
    queryset = User.objects.filter(user_type='client')
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        """Return all clients for admin"""
        return User.objects.filter(user_type='client')
