
export async function emailMyMetrics() {
  const res = await fetch(
    "https://kibehsulqgjfwbalhtgj.functions.supabase.co/email-metrics",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("sb-access-token") || window?.supabase?.auth?.session()?.access_token || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // no body needed for now
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error || "Failed to send metrics email");
  }
  return await res.json();
}
