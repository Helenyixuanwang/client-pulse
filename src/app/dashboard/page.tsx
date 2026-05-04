import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("*, tasks(count), feedback(count)")
    .order("created_at", { ascending: false });

  const activeCount = projects?.filter(p => p.status === "active").length ?? 0;
  const totalTasks = projects?.reduce((sum, p) => sum + (p.tasks[0]?.count ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold">
          Client<span className="text-emerald-400">Pulse</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{user.email}</span>
          <Link
            href="/logout"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign out
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-1">Welcome back, {user.email}</p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
          >
            + New Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Projects", value: projects?.length ?? 0 },
            { label: "Active Projects", value: activeCount },
            { label: "Total Tasks", value: totalTasks },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Projects */}
        <h2 className="text-lg font-semibold mb-4">Your Projects</h2>
        {!projects?.length ? (
          <div className="rounded-xl border border-dashed border-zinc-700 p-10 text-center">
            <p className="text-zinc-400">No projects yet.</p>
            <Link
              href="/dashboard/projects/new"
              className="mt-3 inline-block text-sm text-emerald-400 hover:text-emerald-300"
            >
              Create your first project →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  {project.description && (
                    <p className="text-sm text-zinc-400 mt-0.5">{project.description}</p>
                  )}
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-zinc-500">
                      {project.tasks[0]?.count ?? 0} tasks
                    </span>
                    <span className="text-xs text-zinc-500">
                      {project.feedback[0]?.count ?? 0} feedback
                    </span>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  project.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : project.status === "paused"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-zinc-700 text-zinc-400"
                }`}>
                  {project.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
