import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from users.models import UserProfile


class Command(BaseCommand):
    help = "Create the initial admin user if it does not already exist."

    def add_arguments(self, parser):
        parser.add_argument("--username", default=os.getenv("ADMIN_USERNAME", "admin"))
        parser.add_argument("--password", default=os.getenv("ADMIN_PASSWORD"))
        parser.add_argument(
            "--email",
            default=os.getenv("ADMIN_EMAIL", "admin@thirukumarankumaranmahal.com"),
        )
        parser.add_argument(
            "--full-name",
            default=os.getenv("ADMIN_FULL_NAME", "Admin User"),
        )

    def handle(self, *args, **options):
        User = get_user_model()

        username = options["username"]
        password = options["password"]
        email = options["email"]
        full_name = options["full_name"].strip()

        if not password:
            self.stdout.write(
                self.style.ERROR(
                    "ADMIN_PASSWORD environment variable is not set. "
                    "Admin user was not created."
                )
            )
            return

        user = User.objects.filter(username=username).first()

        if user:
            self.stdout.write(
                self.style.WARNING(
                    f"Admin user '{username}' already exists. "
                    "Password was NOT changed."
                )
            )
        else:
            name_parts = full_name.split()

            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name=name_parts[0] if name_parts else "Admin",
                last_name=" ".join(name_parts[1:]) if len(name_parts) > 1 else "",
            )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created admin user: {username}"
                )
            )

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = UserProfile.ROLE_ADMIN
        profile.full_name = full_name
        profile.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Admin profile ready for: {username}"
            )
        )