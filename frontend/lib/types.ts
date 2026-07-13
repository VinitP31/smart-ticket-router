export type Priority = "High" | "Medium" | "Low";

export interface Issue {
  id: number;
  category: string;
  priority: Priority;
  assigned_team: string;
  reasoning: string;
}

export interface RouteResponse {
  issues: Issue[];
  processing_time_ms: number;
}
