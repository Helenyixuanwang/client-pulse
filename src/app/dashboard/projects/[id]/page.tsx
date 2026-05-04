import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import FeedbackList from "@/components/FeedbackList";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const { data: feedback } = await supabase
    .from("feedback")
    .select("*")
    .eq("project_id", id)
    .order("upvotes", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold">
          Client<span className="text-emerald-400">Pulse</span>
        </span>
        <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Project header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              project.status === "active"
                ? "bg-emerald-500/10 text-emerald-400"
                : project.status === "paused"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-zinc-700 text-zinc-400"
            }`}>
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-zinc-400">{project.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TaskList projectId={id} initialTasks={tasks ?? []} />
          <FeedbackList projectId={id} initialFeedback={feedback ?? []} />
        </div>
      </main>
    </div>
  );
}
