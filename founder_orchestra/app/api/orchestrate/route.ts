/**
 * =============================================================================
 * API ROUTE — /api/orchestrate
 * =============================================================================
 *
 * This is the main API endpoint that triggers the AI orchestration pipeline.
 * When the founder submits their startup idea, this endpoint:
 * 1. Receives the startup input
 * 2. Saves a new project to MongoDB
 * 3. Runs all 6 agents via the orchestrator
 * 4. Streams progress updates back to the frontend
 * 5. Saves the final results to MongoDB
 *
 * STREAMING:
 * Instead of waiting for ALL agents to finish (could take 60+ seconds),
 * we use Server-Sent Events (SSE) to send updates as each agent completes.
 * The frontend receives events like:
 *   { type: "agent-start", agentId: "startup-advisor" }
 *   { type: "agent-complete", agentId: "startup-advisor", output: {...} }
 *
 * Owner: Backend Lead (Team Member C)
 * =============================================================================
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Project } from "@/lib/db/models/project";
import { orchestrate } from "@/lib/agents/orchestrator";
import { validateBody } from "@/lib/validations/helpers";
import { orchestrateRequestSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    // ── Parse & validate request body ───────────────────────────────────
    const validationResult = await validateBody(request, orchestrateRequestSchema);
    if (!validationResult.success) return validationResult.response;
    const body = validationResult.data;

    // ── Connect to MongoDB ──────────────────────────────────────────────
    await connectDB();

    // ── Create or update project in database ────────────────────────────
    let project;
    if (body.projectId) {
      // Re-running for existing project
      project = await Project.findById(body.projectId);
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      project.input = body.input;
      project.overallStatus = "in-progress";
      await project.save();
    } else {
      // New project
      project = await Project.create({
        userId: "anonymous", // TODO: Get from auth session
        input: body.input,
        agents: {},
        overallStatus: "in-progress",
      });
    }

    // ── Create a streaming response ─────────────────────────────────────
    // This uses the Web Streams API to send events in real-time
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Helper to send an event to the client
        const sendEvent = (data: Record<string, unknown>) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        };

        // Send the project ID first so the frontend can track it
        sendEvent({
          type: "project-created",
          projectId: project._id.toString(),
        });

        try {
          // ── Run the orchestrator ──────────────────────────────────
          const results = await orchestrate(body.input, (event) => {
            // Stream each agent event to the client
            sendEvent(event);
          });

          // ── Save final results to MongoDB ─────────────────────────
          project.agents = results;

          // Determine overall status
          const allCompleted = Object.values(results).every(
            (r) => r.status === "completed"
          );
          const anyCompleted = Object.values(results).some(
            (r) => r.status === "completed"
          );

          project.overallStatus = allCompleted
            ? "completed"
            : anyCompleted
            ? "partial"
            : "not-started";

          await project.save();

          // ── Send completion event ─────────────────────────────────
          sendEvent({
            type: "orchestration-complete",
            projectId: project._id.toString(),
            overallStatus: project.overallStatus,
          });
        } catch (error) {
          sendEvent({
            type: "orchestration-error",
            error:
              error instanceof Error
                ? error.message
                : "Orchestration failed",
          });
        } finally {
          controller.close();
        }
      },
    });

    // ── Return the stream as an SSE response ────────────────────────────
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[/api/orchestrate] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
