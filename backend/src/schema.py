"""Pydantic models — the JSON contract. Closed enums make an invented category
or malformed priority fail validation instead of silently passing through."""

from pydantic import BaseModel, Field, field_validator

from src.taxonomy import Category, Priority


class IssueClassification(BaseModel):
    """What the LLM returns per issue — id and team are added later, in code."""

    category: Category
    priority: Priority
    reasoning: str = Field(max_length=200)

    @field_validator("reasoning")
    @classmethod
    def one_line(cls, v: str) -> str:
        return " ".join(v.split())


class RoutingModelOutput(BaseModel):
    issues: list[IssueClassification] = Field(min_length=1)


class Issue(IssueClassification):
    """The final per-issue object the API returns."""

    id: int
    assigned_team: str


class RouteResponse(BaseModel):
    issues: list[Issue] = Field(min_length=1)
    processing_time_ms: int
