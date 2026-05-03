import { PageShell } from "@/components/page-shell";

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        {["Cases", "Uploaded Pleadings", "Open Quality Flags"].map((label) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Workflow</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Create or open a case.</li>
          <li>Upload a pleading PDF.</li>
          <li>Review extracted intake and significant lines.</li>
          <li>Add facts and precedent.</li>
          <li>Generate memo, filing draft, and quality check.</li>
        </ol>
      </div>
    </PageShell>
  );
}
