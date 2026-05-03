import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";

export default async function CaseDetailPage({ params }: { params: { caseId: string } }) {
  const supabase = await createClient();
  const { data: item } = await supabase.from("cases").select("*").eq("id", params.caseId).single();

  return (
    <PageShell title={item?.case_id || "Case Detail"}>
      <pre className="overflow-auto rounded-2xl bg-white p-5 text-sm shadow-sm">{JSON.stringify(item, null, 2)}</pre>
    </PageShell>
  );
}
