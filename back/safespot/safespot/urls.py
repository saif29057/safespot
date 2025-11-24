from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),  # API
    # Servir les fichiers buildés de React
    re_path(r'^assets/(?P<path>.*)$', serve, {
        'document_root': settings.BASE_DIR.parent.parent / 'Front' / 'dist' / 'assets'
    }),
    # Catch-all : toutes les autres routes vont à l'accueil (index.html)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
