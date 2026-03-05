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
from django.urls import path

from rest_framework.decorators import api_view
from rest_framework.response import Response


codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"


@api_view(['GET'])
def api_root(request):
    return Response(
        {
            'activities': f"{base_url}/api/activities/",
            'teams': f"{base_url}/api/teams/",
            'workouts': f"{base_url}/api/workouts/",
            'leaderboard': f"{base_url}/api/leaderboard/",
            'users': f"{base_url}/api/users/",
        }
    )


def _component_list_view(component_name: str):
    @api_view(['GET'])
    def _view(request):
        return Response({'url': f"{base_url}/api/{component_name}/", 'results': []})

    return _view


activities_list = _component_list_view('activities')
teams_list = _component_list_view('teams')
workouts_list = _component_list_view('workouts')
leaderboard_list = _component_list_view('leaderboard')
users_list = _component_list_view('users')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/activities/', activities_list, name='activities-list'),
    path('api/teams/', teams_list, name='teams-list'),
    path('api/workouts/', workouts_list, name='workouts-list'),
    path('api/leaderboard/', leaderboard_list, name='leaderboard-list'),
    path('api/users/', users_list, name='users-list'),
]
