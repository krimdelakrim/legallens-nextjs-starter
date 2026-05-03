import { PageShell } from "@/components/page-shell";
import { uploadPleading } from "./actions";

export default function UploadPage() {
  return (
    <PageShell title="Upload Pleading">
      <form action={uploadPleading} className="max-w-2xl space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <label className="text-sm font-medium">Case ID</label>
          <input name="case_id" defaultValue="CASE-001" className="mt-1 w-full rounded-xl border p-3" />
        </div>
        <div>
          <label className="text-sm font-medium">Pleading ID</label>
          <input name="pleading_id" defaultValue="PLD-001" className="mt-1 w-full rounded-xl border p-3" />
        </div>
        <div>
          <label className="text-sm font-medium">Pleading Type</label>
          <input name="pleading_type" defaultValue="Motion to Seal" className="mt-1 w-full rounded-xl border p-3" />
        </div>
        <div>
          <label className="text-sm font-medium">PDF/Image</label>
          <input name="file" type="file" accept=".pdf,image/*" className="mt-1 w-full rounded-xl border p-3" required />
        </div>
        <button className="rounded-xl bg-slate-900 px-5 py-3 text-white">Upload and Extract</button>
        <p className="text-sm text-slate-500">MVP stores the file privately and creates placeholder OCR text. OCR service hooks are next.</p>
      </form>
    </PageShell>
  );
}
