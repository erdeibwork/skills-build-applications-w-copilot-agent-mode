from django.contrib.auth import get_user_model
from rest_framework import viewsets

from .models import Activity, Leaderboard, Team, Workout
from .serializers import (
    ActivitySerializer,
    LeaderboardSerializer,
    TeamSerializer,
    UserSerializer,
    WorkoutSerializer,
)


class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all().order_by('id')
    serializer_class = TeamSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = get_user_model().objects.select_related('team').all().order_by('id')
    serializer_class = UserSerializer


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Activity.objects.select_related('user', 'user__team')
        .all()
        .order_by('-timestamp', '-id')
    )
    serializer_class = ActivitySerializer


class WorkoutViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Workout.objects.all().order_by('id')
    serializer_class = WorkoutSerializer


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Leaderboard.objects.select_related('team').all().order_by('-points', 'id')
    serializer_class = LeaderboardSerializer
