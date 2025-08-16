import csv
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand, CommandError
from products.models import Product

## This command imports products from a CSV file into the Product model.




## This function normalizes the location input to ensure it matches the expected codes.
## It maps various user inputs to the two valid codes: JO (Jordan) or SA (Saudi Arabia).
## If the input is not recognized, it returns None.
def normalize_location(value: str) -> str: 
    """Map various user inputs to the two valid codes: JO or SA."""
    if value is None:
        return None
    v = value.strip().upper()
    if v in {"JO", "JORDAN"}:
        return "JO"
    if v in {"SA", "KSA", "SAUDI", "SAUDI ARABIA"}:
        return "SA"
    return None

## Management command to import products from a CSV file
## This command reads a CSV file with product details and creates Product instances in the database.
class Command(BaseCommand):
    help = "Import products from a CSV with columns: title, description, price, location"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="Path to CSV file (UTF-8/UTF-8-SIG)")

    def handle(self, *args, **options):
        path = options["csv_path"]

        # Use utf-8-sig to handle BOM if present
        try:
            f = open(path, newline="", encoding="utf-8-sig")
        except FileNotFoundError:
            raise CommandError(f"File not found: {path}")

        created = 0
        skipped = 0
        with f:
            reader = csv.DictReader(f)
            if not reader.fieldnames:
                raise CommandError("CSV has no header row.")

            # Make a case-insensitive check for required headers
            headers = {h.lower(): h for h in reader.fieldnames}
            required = {"title", "description", "price", "location"}
            if not required.issubset(headers.keys()):
                missing = required - set(headers.keys())
                raise CommandError(f"CSV missing required columns: {', '.join(sorted(missing))}")

            for i, row in enumerate(reader, start=2):  # start=2 because row 1 is header
                title = row[headers["title"]].strip()
                description = row[headers["description"]].strip() if row.get(headers["description"]) else ""
                price_raw = row[headers["price"]].strip()
                loc_raw = row[headers["location"]]

                loc = normalize_location(loc_raw)
                if not loc:
                    self.stderr.write(self.style.WARNING(f"Row {i}: invalid location '{loc_raw}', skipping"))
                    skipped += 1
                    continue

                try:
                    price = Decimal(price_raw)
                except (InvalidOperation, TypeError):
                    self.stderr.write(self.style.WARNING(f"Row {i}: invalid price '{price_raw}', skipping"))
                    skipped += 1
                    continue

                Product.objects.create(
                    title=title,
                    description=description,
                    price=price,
                    location=loc,
                )
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Imported {created} products (skipped {skipped})"))
