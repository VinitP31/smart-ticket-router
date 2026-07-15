"use client";

import { useState } from "react";
import TicketComposer from "@/components/TicketComposer";
import SampleTickets from "@/components/SampleTickets";
import RoutingProgress from "@/components/RoutingProgress";
import IssueCard from "@/components/IssueCard";
import JsonToggle from "@/components/JsonToggle";
import ProcessingTime from "@/components/ProcessingTime";
import ThemeToggle from "@/components/ThemeToggle";
import { routeTicket } from "@/lib/api";
import type { RouteResponse } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [ticket, setTicket] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RouteResponse | null>(null);
  const [runId, setRunId] = useState(0);

  const handleSubmit = async () => {
    if (ticket.trim().length === 0 || status === "loading") return;
    setRunId((id) => id + 1);
    setStatus("loading");
    try {
      const data = await routeTicket(ticket);
      setResult(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen">
      <svg className={`flow-lines pointer-events-none absolute inset-0 h-full w-full ${status === "loading" ? "busy" : ""}`}>
        <path d="M 340 260 C 500 260, 480 120, 660 130 S 900 260, 1000 260" />
        <path d="M 300 420 C 500 480, 600 380, 760 420 S 950 500, 1050 470" />
        <path d="M 360 200 C 460 160, 560 240, 700 210" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-6 py-8 sm:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]"
              style={{ backgroundImage: "linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2))" }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M4 7h11a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 12 6 15l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-[21px] font-extrabold tracking-tight text-ink">Smart Ticket Router</h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs text-ink-soft"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: status === "loading" ? "var(--color-accent-1)" : "var(--color-low)",
                  boxShadow: status === "loading" ? "0 0 8px var(--color-accent-1)" : "none",
                }}
                aria-hidden="true"
              />
              flow {status === "loading" ? "active" : "idle"}
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(280px,360px)_1fr_minmax(280px,1fr)]">
          <div>
            <div className="mb-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-label uppercase">
              Inbound feed
            </div>
            <TicketComposer value={ticket} onChange={setTicket} onSubmit={handleSubmit} status={status} />
            <SampleTickets value={ticket} onChange={setTicket} />
          </div>

          <RoutingProgress key={runId} active={status === "loading"} />

          <div>
            <div className="mb-3 flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-label uppercase">
              Team lanes
              {status === "success" && result && <ProcessingTime processingTimeMs={result.processing_time_ms} />}
            </div>

            <div aria-live="polite">
              {status === "error" ? (
                <div
                  className="shake-once flex min-h-[220px] flex-col items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed p-6 text-center"
                  style={{ borderColor: "var(--color-high)" }}
                >
                  <p className="text-sm font-bold" style={{ color: "var(--color-high)" }}>
                    Service temporarily unavailable
                  </p>
                  <p className="text-[13px] text-ink-soft">
                    We couldn&apos;t reach the routing service. Please try again in a moment.
                  </p>
                </div>
              ) : status === "success" && result && result.issues.length === 1 && !result.issues[0].is_ticket ? (
                <div
                  className="flex min-h-[220px] items-center justify-center rounded-2xl border p-6 text-center"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
                >
                  <p className="text-[13.5px] leading-relaxed text-ink-soft">{result.issues[0].reasoning}</p>
                </div>
              ) : status === "success" && result ? (
                <ul className="flex flex-col gap-3">
                  {result.issues.map((issue, index) => (
                    <IssueCard key={issue.id} issue={issue} index={index} />
                  ))}
                </ul>
              ) : (
                <div
                  className="flex min-h-[220px] items-center justify-center rounded-2xl border-[1.5px] border-dashed p-6 text-center font-mono text-xs tracking-wide text-ink-faint uppercase"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  Awaiting flow — route a ticket
                </div>
              )}
            </div>
          </div>
        </div>

        <JsonToggle data={status === "success" ? result : null} />
      </div>
    </div>
  );
}
