
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Message = { from: "user" | "ai"; text: string };

export default function AnalyticsChat() {
  const [messages, setMessages] = useState<Message[]>([{ from: "ai", text: "Hi! Ask me anything about your analytics or KPIs." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;
    const prompt = input.trim();
    setInput("");
    setMessages((msgs) => [...msgs, { from: "user", text: prompt }]);
    setLoading(true);
    try {
      const res = await fetch("https://kibehsulqgjfwbalhtgj.functions.supabase.co/analytics-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages((msgs) => [...msgs, { from: "ai", text: data.answer }]);
      } else {
        setMessages((msgs) => [...msgs, { from: "ai", text: "Sorry, I couldn't generate a response." }]);
      }
    } catch (err) {
      toast({ title: "Chat error", description: "Failed to contact the AI assistant.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>
      </div>
      <Card className="p-4 min-h-[420px] bg-background">
        <div className="flex flex-col gap-3 mb-2 h-[390px] overflow-y-auto max-h-[390px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-3 py-2 max-w-[90%] ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-muted text-foreground self-start border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <form
        className="flex gap-2 mt-3"
        onSubmit={e => {
          e.preventDefault();
          if (!loading) sendMessage();
        }}
      >
        <Input
          placeholder="Ask the AI about your analytics…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? "Sending…" : "Send"}
        </Button>
      </form>
    </div>
  );
}
