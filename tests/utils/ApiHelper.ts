import { Page } from '@playwright/test';

/**
 * AppBuilderApiHelper
 *
 * A utility class for intercepting and polling the App Builder project API.
 * It supports two strategies:
 *
 *  1. waitForProjectState()  — passively intercepts browser-initiated GET
 *     responses for a project and waits until `data.state` matches the target.
 *
 *  2. pollProjectState()     — actively calls the project endpoint from within
 *     the browser context (reusing the logged-in session) and polls at a
 *     configurable interval until the target state is reached.
 */
export class AppBuilderApiHelper {
  private page: Page;
  private apiBaseUrl: string;

  constructor(page: Page, apiBaseUrl: string = 'https://api-builder-dev.uptiq.dev') {
    this.page = page;
    this.apiBaseUrl = apiBaseUrl;
  }

  // ---------------------------------------------------------------------------
  // Strategy 1 — Intercept browser-initiated GET responses (passive)
  // ---------------------------------------------------------------------------

  /**
   * Listens to every GET response for `/app-builder/projects/{projectId}` that
   * the browser fires on its own polling cycle, extracts `data.state`, and
   * resolves once the target state is reached.
   *
   * @param projectId   UUID of the project returned from the POST create call.
   * @param targetState The state string to wait for (e.g. "WAITING_FOR_USER_INPUT").
   * @param timeoutMs   Maximum time to wait in ms (default 120 s).
   */
  async waitForProjectState(
    projectId: string,
    targetState: string,
    timeoutMs: number = 120000
  ): Promise<{ state: string; data: Record<string, unknown> }> {
    const deadline = Date.now() + timeoutMs;
    const urlFragment = `/app-builder/projects/${projectId}`;

    console.log(`[ApiHelper] Waiting for project ${projectId} → state "${targetState}"`);

    while (Date.now() < deadline) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;

      try {
        const response = await this.page.waitForResponse(
          (res) =>
            res.url().includes(urlFragment) &&
            res.request().method() === 'GET' &&
            res.status() === 200,
          { timeout: Math.min(15000, remaining) }
        );

        const body = await response.json() as {
          data?: { state?: string };
        };

        const currentState = body?.data?.state ?? 'unknown';
        console.log(`[ApiHelper]   current state → ${currentState}`);

        if (currentState === targetState) {
          console.log(`[ApiHelper] Target state "${targetState}" reached ✓`);
          return { state: currentState, data: body.data as Record<string, unknown> };
        }
      } catch {
        // Individual waitForResponse timed out — loop again if overall time remains.
        if (Date.now() >= deadline) break;
      }
    }

    throw new Error(
      `[ApiHelper] Project "${projectId}" did not reach state "${targetState}" within ${timeoutMs} ms`
    );
  }

  /**
   * Waits until the project state changes from a known baseline state.
   * Useful to validate that a Save/Build action has started a new generation cycle.
   */
  async waitForStateChangeFrom(
    projectId: string,
    previousState: string,
    timeoutMs: number = 120000
  ): Promise<{ state: string; data: Record<string, unknown> }> {
    const deadline = Date.now() + timeoutMs;
    const urlFragment = `/app-builder/projects/${projectId}`;

    console.log(
      `[ApiHelper] Waiting for project ${projectId} to move away from state "${previousState}"`
    );

    while (Date.now() < deadline) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;

      try {
        const response = await this.page.waitForResponse(
          (res) =>
            res.url().includes(urlFragment) &&
            res.request().method() === 'GET' &&
            res.status() === 200,
          { timeout: Math.min(15000, remaining) }
        );

        const body = (await response.json()) as {
          data?: { state?: string };
        };

        const currentState = body?.data?.state ?? 'unknown';
        console.log(`[ApiHelper]   current state → ${currentState}`);

        if (currentState !== previousState) {
          console.log(
            `[ApiHelper] State changed from "${previousState}" to "${currentState}" ✓`
          );
          return { state: currentState, data: body.data as Record<string, unknown> };
        }
      } catch {
        if (Date.now() >= deadline) break;
      }
    }

    throw new Error(
      `[ApiHelper] Project "${projectId}" did not change from state "${previousState}" within ${timeoutMs} ms`
    );
  }

  // ---------------------------------------------------------------------------
  // Strategy 2 — Active polling via page.evaluate (explicit API calls)
  // ---------------------------------------------------------------------------

  /**
   * Actively calls the project API from within the browser context at a fixed
   * interval, reusing the logged-in session (credentials: 'include').
   * Resolves once `data.state` matches `targetState`.
   *
   * @param projectId   UUID of the project.
   * @param targetState The state string to wait for.
   * @param intervalMs  How long to wait between polls (default 5 s).
   * @param timeoutMs   Maximum total wait time in ms (default 120 s).
   */
  async pollProjectState(
    projectId: string,
    targetState: string,
    intervalMs: number = 5000,
    timeoutMs: number = 120000
  ): Promise<{ state: string; data: Record<string, unknown> }> {
    const deadline = Date.now() + timeoutMs;
    const url = `${this.apiBaseUrl}/app-builder/projects/${projectId}`;

    console.log(`[ApiHelper] Polling ${url} for state "${targetState}"`);

    while (Date.now() < deadline) {
      const result = await this.page.evaluate(
        async (fetchUrl: string) => {
          try {
            const res = await fetch(fetchUrl, { credentials: 'include' });
            if (!res.ok) return null;
            return res.json();
          } catch {
            return null;
          }
        },
        url
      ) as { data?: { state?: string } } | null;

      const currentState = result?.data?.state ?? 'unknown';
      console.log(`[ApiHelper]   polled state → ${currentState}`);

      if (currentState === targetState) {
        console.log(`[ApiHelper] Target state "${targetState}" reached ✓`);
        return { state: currentState, data: result!.data as Record<string, unknown> };
      }

      await this.page.waitForTimeout(intervalMs);
    }

    throw new Error(
      `[ApiHelper] Project "${projectId}" did not reach state "${targetState}" within ${timeoutMs} ms`
    );
  }

  // ---------------------------------------------------------------------------
  // Convenience: get the state from the NEXT matching response (one-shot)
  // ---------------------------------------------------------------------------

  /**
   * Returns the `data.state` from the very next GET project response seen in
   * the network tab. Useful for a single-shot state snapshot.
   */
  async getNextProjectState(projectId: string, timeoutMs: number = 15000): Promise<string> {
    const response = await this.page.waitForResponse(
      (res) =>
        res.url().includes(`/app-builder/projects/${projectId}`) &&
        res.request().method() === 'GET' &&
        res.status() === 200,
      { timeout: timeoutMs }
    );

    const body = await response.json() as { data?: { state?: string } };
    return body?.data?.state ?? 'unknown';
  }
}
