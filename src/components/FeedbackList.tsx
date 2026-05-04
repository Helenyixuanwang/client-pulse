"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Feedback = {
  id: string;
  content: string;
  upvotes: number;
  created_at: string;
};

export default function FeedbackList({
  projectId,
  initialFeedback,
}: {
  projectId: string;
  initialFeedback: Feedback[];
}) {
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const addFeedback = async () => {
    if (!content.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("feedback")
      .insert({ content: content.trim(), project_id: projectId })
      .select()
      .single();

    if (!error && data) {
      setFeedback([data, ...feedback]);
      setContent("");
    }
    setLoading(false);
  };

  const upvote = async (id: string, current: number) => {
    const supabase = createClient();
    await supabase.from("feedback").update({ upvotes: current + 1 }).eq("id", id);
    setFeedback(feedback.map((f) => (f.id === id ? { ...f, upvotes: current + 1 } : f)));
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-lg font-semibold mb-4">Feedback</h2>

      {/* Add feedback */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addFeedback()}
          placeholder="Add feedback…"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={addFeedback}
          disabled={loading || !content.trim()}
          className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Feedback list */}
      {feedback.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-4">No feedback yet</p>
      ) : (
        <div className="space-y-2">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5"
            >
              <span className="text-sm text-white">{item.content}</span>
              <button
                onClick={() => upvote(item.id, item.upvotes)}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors ml-3 shrink-0"
              >
                ▲ {item.upvotes}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
