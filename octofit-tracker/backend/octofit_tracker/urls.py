"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

import os

from django.contrib import admin
from django.urls import include, path

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from .views import ActivityViewSet, LeaderboardViewSet, TeamViewSet, UserViewSet, WorkoutViewSet


codespace_name = os.environ.get('CODESPACE_NAME')
codespace_base_url = (
    f"https://{codespace_name}-8000.app.github.dev" if codespace_name else "http://localhost:8000"
)


@api_view(['GET'])
def api_root(request):
    return Response(
        {
            'activities': f"{codespace_base_url}/api/activities/",
            'teams': f"{codespace_base_url}/api/teams/",
            'workouts': f"{codespace_base_url}/api/workouts/",
            'leaderboard': f"{codespace_base_url}/api/leaderboard/",
            'users': f"{codespace_base_url}/api/users/",
        }
    )


router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', api_root, name='root'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
