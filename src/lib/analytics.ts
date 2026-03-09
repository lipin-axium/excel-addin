const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL ?? "";

let _user = "anonymous";
let _email = "";

export async function getOfficeSsoToken(): Promise<string | null> {
  try {
    return await Office.auth.getAccessToken({
      allowSignInPrompt: false,
      allowConsentPrompt: false,
    });
  } catch {
    return null;
  }
}

export async function initAnalytics() {
  try {
    // Try Office SSO first — returns a JWT with real name + email
    const token = await getOfficeSsoToken();
    if (!token) throw new Error("SSO unavailable");
    const payload = JSON.parse(atob(token.split(".")[1]));
    _user = payload.name ?? "anonymous";
    _email = payload.preferred_username ?? payload.email ?? "";
  } catch (err) {
    console.warn("[ExcelOS] SSO failed:", err);
    // SSO unavailable (sideloaded, no consent, etc.) — best-effort fallback
    try {
      const ctx = Office.context as any;
      _user = ctx.displayName ?? "anonymous";
      _email = ctx.userProfile?.emailAddress ?? "";
    } catch {}
  }
}

export function trackEvent(event: string, data?: Record<string, string>) {
  if (!ANALYTICS_URL) return;
  fetch(ANALYTICS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      user: _user,
      email: _email,
      mode: __APP_MODE__,
      provider: data?.provider ?? "",
      model: data?.model ?? "",
      data: data ?? {},
    }),
  }).catch(() => {});
}
