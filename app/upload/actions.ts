"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { extractAutoIntake, extractSignificantLines } from "@/lib/legal/parser";

export async function uploadPleading(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const file = formData.get("file") as File | null;
  const caseId = String(formData.get("case_id") || "CASE-001");
  const pleadingId = String(formData.get("pleading_id") || "PLD-001");
  const pleadingType = String(formData.get("pleading_type") || "Motion to Seal");

  if (!file) throw new Error("No file uploaded.");

  const path = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("pleadings").upload(path, file, { upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  // MVP placeholder: OCR/text extraction is stubbed. Next step is Google Document AI or AWS Textract.
  const ocrText = `OCR placeholder for ${file.name}. Replace lib/ocr/extract.ts with Document AI/Textract output.`;
  const intake = extractAutoIntake(ocrText, { caseId, pleadingId, pleadingType });
  const lines = extractSignificantLines(ocrText, pleadingType);

  const { data: caseRow, error: caseError } = await supabase.from("cases").insert({
    user_id: user.id,
    case_id: caseId,
    debtor_name: intake.debtor_name,
    case_number: intake.case_number,
    chapter: intake.chapter,
    court: intake.court,
    status: "Open"
  }).select("id").single();
  if (caseError) throw new Error(caseError.message);

  const { data: pleadingRow, error: pleadingError } = await supabase.from("pleadings").insert({
    user_id: user.id,
    case_uuid: caseRow.id,
    pleading_id: pleadingId,
    pleading_type: pleadingType,
    issue_type: intake.issue_type,
    source_file_path: path,
    ocr_text: ocrText,
    requested_relief: intake.requested_relief,
    cited_authority: intake.cited_authority,
    status: "Imported"
  }).select("id").single();
  if (pleadingError) throw new Error(pleadingError.message);

  if (lines.length) {
    await supabase.from("significant_lines").insert(lines.map((l) => ({
      user_id: user.id,
      case_uuid: caseRow.id,
      pleading_uuid: pleadingRow.id,
      line_text: l.line,
      issue_type: l.issue_type,
      element: l.element,
      authority: l.authority,
      confidence: l.confidence,
      approved: true
    })));
  }

  redirect("/intake-review");
}
