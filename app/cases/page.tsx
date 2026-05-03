import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";

export default async function CasesPage() {
  const supabase = await createClient();
  const { data: cases } = await supabase.from("cases").select("id, case_id, debtor_name, case_number, chapter, status").order("created_at", { ascending: false });

  return (
    <PageShell title="Cases">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Private case/matter list. Row-level security keeps each user limited to their own matters.</p>
        <div className="mt-4 divide-y">
          {(cases || []).map((c) => (
            <Link key={c.id} href={`/cases/${c.id}`} className="block py-3 hover:bg-slate-50">
              <div className="font-semibold">{c.case_id} — {c.debtor_name || "Untitled debtor"}</div>
              <div className="text-sm text-slate-500">{c.case_number || "No case number"} · {c.chapter || "No chapter"} · {c.status}</div>
            </Link>
          ))}
          {!cases?.length ? <p className="py-4 text-sm text-slate-500">No cases yet. Upload a pleading or insert a case through Supabase to test.</p> : null}
        </div>
      </div>
    </PageShell>
  );
}
