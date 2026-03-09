import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    INSPECTOR = "inspector"
    SUPERVISOR = "supervisor"
    CONTRACTOR = "contractor"


class InspectionStatus(str, enum.Enum):
    OPEN = "open"
    IN_REVIEW = "in_review"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class InspectionPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"