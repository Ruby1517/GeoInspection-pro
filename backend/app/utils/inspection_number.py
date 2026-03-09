from datetime import datetime


def generate_inspection_number(next_id: int) -> str:
    date_part = datetime.utcnow().strftime("%Y%m%d")
    return f"GI-{date_part}-{next_id:04d}"