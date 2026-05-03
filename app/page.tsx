import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Private litigation workspace</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">LegalLens Bankruptcy Research App</h1>
        <p className="mt-4 text-lg text-slate-600">
          Upload pleadings, extract intake data, review significant legal lines, track precedent, and generate research drafts.
        </p>
        <div className="mt-8 flex gap-3">
          <Link className="rounded-xl bg-slate-900 px-5 py-3 text-white" href="/login">Sign in</Link>
          <Link className="rounded-xl border px-5 py-3" href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
