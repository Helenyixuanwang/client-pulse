"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  due_date: string | null;
  created_at: string;
};

export default function TaskList({
  projectId,
  initialTasks,
}: {
  projectId: string;
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addTask = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .insert({ title: title.trim(), project_id: projectId, status: "todo" })
      .select()
      .single();

    if (!error && data) {
      setTasks([data, ...tasks]);
      setTitle("");
    }
    setLoading(false);
  };

  const updateStatus = async (taskId: string, status: Task["status"]) => {
    const supabase = createClient();
    await supabase.from("tasks").update({ status }).eq("id", taskId);
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status } : t)));
  };

  const statusColor = {
    "todo": "text-zinc-400",
    "in-progress": "text-yellow-400",
    "done": "text-emerald-400",
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>

      {/* Add task */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task…"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={addTask}
          disabled={loading || !title.trim()}
          className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-4">No tasks yet</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5"
            >
              <span className={`text-sm ${task.status === "done" ? "line-through text-zinc-500" : "text-white"}`}>
                {task.title}
              </span>
              <select
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value as Task["status"])}
                className={`text-xs bg-transparent border-none focus:outline-none cursor-pointer ${statusColor[task.status]}`}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
