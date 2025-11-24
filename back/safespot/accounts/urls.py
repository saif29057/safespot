from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import (
    login_view, 
    password_reset_view, 
    ReviewViewSet,
    ClientViewSet,
    get_user_profile,
    get_statistics
)

router = DefaultRouter()
router.register('reviews', ReviewViewSet, basename='review')
router.register('clients', ClientViewSet, basename='client')

urlpatterns = [
    path('login/', login_view, name='login'),
    path('password-reset/', password_reset_view, name='password-reset'),
    path('profile/', get_user_profile, name='user-profile'),
    path('statistics/', get_statistics, name='statistics'),
    path('', include(router.urls)),
]
