"use client";

import { useState } from "react";
import RoutingRig from "@/components/RoutingRig";
import TicketComposer from "@/components/TicketComposer";
import IssueCard from "@/components/IssueCard";
import JsonToggle from "@/components/JsonToggle";
import ProcessingTime from "@/components/ProcessingTime";
import RoutingProgress from "@/components/RoutingProgress";
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

  const priorities = status === "success" && result ? result.issues.map((i) => i.priority) : [];

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[minmax(260px,38%)_1fr]">
      <div className="relative min-h-[46vh] overflow-hidden" style={{ backgroundColor: "var(--color-rig-bg)" }}>
        <RoutingRig priorities={priorities} routing={status === "loading"} />
        <div
          className="pointer-events-none absolute bottom-5 left-5 font-mono text-[10.5px] tracking-[0.14em] text-[rgba(241,235,220,0.4)] uppercase"
          aria-hidden="true"
        >
          <b style={{ color: "var(--color-stamp)" }}>◉</b> three.js — transmission glass, live state
        </div>
      </div>

      <div className="ruled-paper relative px-[6vw] py-11 sm:px-[8vw]">
        <div className="paper-texture" aria-hidden="true" />

        <div className="relative">
          <div
            className="mb-6.5 flex items-start justify-between gap-3 border-b-2 pb-4"
            style={{ borderColor: "var(--color-ink)" }}
          >
            <div>
              <h1 className="font-serif text-4xl font-bold text-ink italic sm:text-5xl">
                Smart Ticket Router
              </h1>
              <p className="mt-2.5 max-w-[46ch] font-mono text-[12.5px] leading-relaxed text-ink-soft">
                One message in. Every independent problem, split out, stamped, and sent to the desk
                that owns it.
              </p>
            </div>
            <ThemeToggle />
          </div>

          <TicketComposer
            value={ticket}
            onChange={setTicket}
            onSubmit={handleSubmit}
            loading={status === "loading"}
          />

          <RoutingProgress key={runId} active={status === "loading"} />

          <div aria-live="polite">
            {status === "error" && (
              <div
                className="shake-once mt-6 border-l-4 p-4"
                style={{ borderColor: "var(--color-high)", backgroundColor: "var(--color-paper-2)" }}
              >
                <p className="font-bold" style={{ color: "var(--color-high)" }}>
                  Service temporarily unavailable
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  We couldn&apos;t reach the routing service. Please try again in a moment.
                </p>
              </div>
            )}

            {status === "success" && result && (
              <div className="mt-7">
                <div className="mb-1 flex items-center gap-2.5 text-[10px] tracking-[0.14em] text-ink-faint uppercase">
                  routed — <ProcessingTime processingTimeMs={result.processing_time_ms} />
                  <span
                    className="h-px flex-1 border-t border-dashed"
                    style={{ borderColor: "var(--color-rule)" }}
                  />
                </div>

                <ul>
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

          <p className="mt-10 text-[10px] tracking-[0.1em] text-ink-faint uppercase">
            smart ticket router · routes each ticket to the team that owns it
          </p>
        </div>
      </div>
    </div>
  );
}
