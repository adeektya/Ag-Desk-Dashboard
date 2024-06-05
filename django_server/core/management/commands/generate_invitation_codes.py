from django.core.management.base import BaseCommand
from core.models import InvitationCode
import uuid

class Command(BaseCommand):
    help = 'Generates a set of invitation codes for owner registration.'

    def add_arguments(self, parser):
        parser.add_argument('count', type=int, help='Number of invitation codes to generate')

    def handle(self, *args, **options):
        count = options['count']
        codes = []
        for _ in range(count):
            code = str(uuid.uuid4())[:8]  # Generate a random 8-character code
            while InvitationCode.objects.filter(code=code).exists():
                code = str(uuid.uuid4())[:8]  # Ensure uniqueness
            codes.append(InvitationCode(code=code))
        InvitationCode.objects.bulk_create(codes)
        self.stdout.write(self.style.SUCCESS(f'Successfully generated {count} invitation codes.'))
