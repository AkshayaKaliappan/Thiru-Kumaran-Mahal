"""
Management command to create the development admin account.

⚠️  DEVELOPMENT ONLY - Change credentials before production deployment!
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import UserProfile


class Command(BaseCommand):
    help = (
        'Create development admin account.\n'
        '⚠️  DEVELOPMENT ONLY. Change credentials before production!'
    )

    def add_arguments(self, parser):
        parser.add_argument('--username', default='admin')
        parser.add_argument('--password', default='Function@2026')
        parser.add_argument('--email', default='admin@thirumahal.local')
        parser.add_argument('--full-name', default='Admin User')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        email = options['email']
        full_name = options['full_name']

        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user.set_password(password)
            user.email = email
            user.save()
            self.stdout.write(f'Updated existing user: {username}')
        else:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name=full_name.split()[0],
                last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else '',
            )
            self.stdout.write(
                self.style.SUCCESS(f'Created admin user: {username}')
            )

        # Ensure profile with admin role
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.role = UserProfile.ROLE_ADMIN
        profile.full_name = full_name
        profile.save()

        self.stdout.write(self.style.SUCCESS(
            f'\n[SUCCESS] Dev admin ready:\n'
            f'   Username: {username}\n'
            f'   Password: {password}\n'
            f'   Role:     Admin\n\n'
            f'[WARNING] CHANGE THESE CREDENTIALS BEFORE PRODUCTION DEPLOYMENT!'
        ))
