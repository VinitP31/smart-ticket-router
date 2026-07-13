"use client";

import { useState } from "react";
import TicketComposer from "@/components/TicketComposer";
import IssueCard from "@/components/IssueCard";
import JsonToggle from "@/components/JsonToggle";
import ProcessingTime from "@/components/ProcessingTime";
import { routeTicket } from "@/lib/api";
import type { RouteResponse } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [ticket, setTicket] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RouteResponse | null>(null);

  const handleSubmit = async () => {
    if (ticket.trim().length === 0 || status === "loading") return;
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
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-14 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="pulse-glow flex h-12 w-12 items-center justify-center rounded-2xl shadow-[0_10px_28px_-8px_rgba(124,58,237,0.6)]"
          style={{ backgroundImage: "linear-gradient(135deg,#7c3aed,#4c6fff 55%,#e11d48)" }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
            <path
              d="M4 12h6M4 6h12M4 18h9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="6" r="2" fill="#fbbf24" />
          </svg>
        </div>
        <div>
          <h1 className="gradient-text font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Smart Ticket Router
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate">
            Paste a support ticket. Get an instant, explained routing decision.
          </p>
        </div>
      </div>

      <TicketComposer
        value={ticket}
        onChange={setTicket}
        onSubmit={handleSubmit}
        loading={status === "loading"}
      />

      <div aria-live="polite" className="contents">
        {status === "error" && (
          <div className="card-settle shake-once relative flex w-full max-w-xl items-start gap-3 overflow-hidden rounded-2xl border border-high/25 bg-white/85 p-4 shadow-[0_16px_40px_-12px_rgba(229,72,77,0.35)] backdrop-blur-md">
            <span
              className="absolute inset-x-0 top-0 h-1"
              style={{ background: "linear-gradient(90deg,#e11d48,#f97316)" }}
              aria-hidden="true"
            />
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: "linear-gradient(135deg,#e11d48,#f97316)" }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-high">Service temporarily unavailable</p>
              <p className="mt-0.5 text-sm text-ink/70">
                We couldn&apos;t reach the routing service. Please try again in a moment.
              </p>
            </div>
          </div>
        )}

        {status === "success" && result && (
          <div className="w-full max-w-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <ProcessingTime processingTimeMs={result.processing_time_ms} />
              {result.issues.length > 1 && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-md"
                  style={{ backgroundImage: "linear-gradient(100deg,#7c3aed,#4c6fff)" }}
                >
                  {result.issues.length} issues detected
                </span>
              )}
            </div>

            <ul className="flex flex-col gap-3">
              {result.issues.map((issue, index) => (
                <IssueCard key={issue.id} issue={issue} index={index} />
              ))}
            </ul>

            <div className="mt-5">
              <JsonToggle data={result} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
