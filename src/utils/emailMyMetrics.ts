
export async function emailMyMetrics() {
  const accessToken =
    localStorage.getItem("sb-access-token") ||
    (window as any)?.supabase?.auth?.session?.()?.access_token ||
    "";
  const res = await fetch(
    "https://kibehsulqgjfwbalhtgj.functions.supabase.co/email-metrics",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // no body needed for now
    }
  );

  if (!res.ok) {
    let data: any = {};
    try {
      data = await res.json();
    } catch { /* do nothing */ }
    throw new Error(data?.error || "Failed to send metrics email");
  }
  return await res.json();
}
