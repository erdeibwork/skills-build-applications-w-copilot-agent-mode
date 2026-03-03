from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from octofit_tracker.models import Team, Activity, Leaderboard, Workout
from django.db import transaction

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        User = get_user_model()
        with transaction.atomic():
            # Clear existing data
            User.objects.all().delete()
            Team.objects.all().delete()
            Activity.objects.all().delete()
            Leaderboard.objects.all().delete()
            Workout.objects.all().delete()

            # Create Teams
            marvel = Team.objects.create(name='Marvel')
            dc = Team.objects.create(name='DC')

            # Create Users (Superheroes)
            users = [
                User.objects.create_user(username='ironman', email='ironman@marvel.com', password='password', team=marvel),
                User.objects.create_user(username='captainamerica', email='cap@marvel.com', password='password', team=marvel),
                User.objects.create_user(username='batman', email='batman@dc.com', password='password', team=dc),
                User.objects.create_user(username='superman', email='superman@dc.com', password='password', team=dc),
            ]

            # Create Activities
            for user in users:
                Activity.objects.create(user=user, type='run', duration=30, distance=5)
                Activity.objects.create(user=user, type='cycle', duration=60, distance=20)

            # Create Workouts
            Workout.objects.create(name='Morning Cardio', description='Cardio session for all heroes')
            Workout.objects.create(name='Strength Training', description='Strength session for all heroes')

            # Create Leaderboard
            Leaderboard.objects.create(team=marvel, points=100)
            Leaderboard.objects.create(team=dc, points=90)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
