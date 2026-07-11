"""FastAPI app: /route and /health. Timing measured at the boundary, per the
Golden Rules — route_ticket() never raises, never returns a 5xx."""

import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.config import ALLOWED_ORIGINS
from src.router import route_ticket

app = FastAPI(title="Smart Ticket Router")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketIn(BaseModel):
    ticket: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/route")
def route(body: TicketIn):
    start = time.perf_counter()
    result = route_ticket(body.ticket)
    result["processing_time_ms"] = round((time.perf_counter() - start) * 1000)
    return result
