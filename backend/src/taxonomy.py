"""The 9 closed categories, their team mapping, and the priority rubric text."""

from enum import Enum


class Category(str, Enum):
    AUTH = "Authentication & Login"
    BILLING = "Billing & Payments"
    BUG = "Technical Bug"
    PERF = "Performance & Availability"
    FEATURE = "Feature Request"
    ACCOUNT = "Account Management"
    SECURITY = "Security & Access"
    ORDERS = "Orders & Operations"
    GENERAL = "General / Uncategorized"


class Priority(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


TEAM_BY_CATEGORY = {
    Category.AUTH: "Identity Team",
    Category.BILLING: "Finance Team",
    Category.BUG: "Engineering Team",
    Category.PERF: "Platform Team",
    Category.FEATURE: "Product Team",
    Category.ACCOUNT: "Customer Success Team",
    Category.SECURITY: "Security Team",
    Category.ORDERS: "Operations Team",
    Category.GENERAL: "Human Triage",
}

PRIORITY_RUBRIC = """\
PRIORITY (business impact, NOT tone, NOT category):
- High: financial loss, incorrect payment, security/privacy risk, outage, many users
  affected, critical workflow blocked, revenue impact, long-pending critical issue.
- Medium: one user's important workflow affected, workaround available, moderate impact.
- Low: questions, feature requests, documentation, suggestions, routine account changes.
"""
