export type IntakeContext = { caseId: string; pleadingId: string; pleadingType: string };

export function normalize(value: string) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function extractAutoIntake(text: string, context: IntakeContext) {
  const clean = text.replace(/\r/g, "\n");
  const caseNumber = clean.match(/Case\s+No\.?\s*[:#]?\s*([A-Za-z0-9:\-_.]+)/i)?.[1] || null;
  const chapterMatch = clean.match(/Chapter\s+(7|11|12|13)/i)?.[1];
  const chapter = chapterMatch ? `Chapter ${chapterMatch}` : null;
  const debtor = clean.match(/In\s+re:?\s*\n?\s*([A-Z][A-Za-z0-9 .,'-]+?)(?:,?\s*Debtor|Case\s+No|Chapter)/i)?.[1]?.trim() || null;
  const lower = normalize(clean + " " + context.pleadingType);

  let issueType = "Motion / Pleading Requiring Research";
  if (lower.includes("seal") || lower.includes("confidential")) issueType = "Motion to Seal / Protective Order";
  if (lower.includes("relief from stay")) issueType = "Motion for Relief from Stay";
  if (lower.includes("proof of claim") || lower.includes("claim objection")) issueType = "Objection to Proof of Claim";
  if (lower.includes("avoid lien")) issueType = "Motion to Avoid Judicial Lien";

  const requestedRelief = clean.match(/WHEREFORE[,:\s]+(.+?)(?:Respectfully submitted|Dated:|Certificate of Service|$)/is)?.[1]?.trim().slice(0, 1000) || null;
  const citedAuthority = Array.from(clean.matchAll(/(?:11|28)\s+U\.?S\.?C\.?\s*§+\s*[0-9a-zA-Z()\-., ]+|Fed\.?\s*R\.?\s*Bankr\.?\s*P\.?\s*[0-9a-zA-Z().\-]+/g)).map(m => m[0].trim()).join("; ") || null;

  return {
    debtor_name: debtor,
    case_number: caseNumber,
    chapter,
    court: clean.toUpperCase().includes("SOUTHERN DISTRICT OF WEST VIRGINIA") ? "U.S. Bankruptcy Court, S.D. W. Va." : null,
    issue_type: issueType,
    requested_relief: requestedRelief,
    cited_authority: citedAuthority
  };
}

export function extractSignificantLines(text: string, pleadingType: string) {
  const chunks = String(text || "")
    .replace(/\r/g, "\n")
    .split(/\n|(?<=\.)\s+(?=[A-Z0-9])/g)
    .map(s => s.replace(/\s+/g, " ").trim())
    .filter(s => s.length > 20)
    .slice(0, 200);

  return chunks.map((line) => detectLine(line, pleadingType)).filter(Boolean) as Array<{
    line: string;
    issue_type: string;
    element: string;
    authority: string;
    confidence: string;
  }>;
}

function detectLine(line: string, pleadingType: string) {
  const txt = normalize(line + " " + pleadingType);
  const legalSignal = ["motion", "pursuant", "rule", "section", "claim", "evidence", "exhibit", "cause", "harm", "seal", "confidential", "stay", "lien", "discharge", "service", "notice"].some(w => txt.includes(w));
  if (!legalSignal) return null;

  if (txt.includes("seal") || txt.includes("confidential") || txt.includes("harm")) {
    return { line, issue_type: "Motion to Seal / Protective Order", element: txt.includes("harm") ? "Concrete harm" : "Specific grounds / narrow tailoring", authority: "Fed. R. Bankr. P. 9018; 11 U.S.C. § 107", confidence: "High" };
  }
  if (txt.includes("relief from stay") || txt.includes("adequate protection")) {
    return { line, issue_type: "Motion for Relief from Stay", element: "Cause / adequate protection", authority: "11 U.S.C. § 362(d); Fed. R. Bankr. P. 4001", confidence: "High" };
  }
  if (txt.includes("proof of claim") || txt.includes("assignment") || txt.includes("prima facie")) {
    return { line, issue_type: "Objection to Proof of Claim", element: "Prima facie validity / ownership", authority: "11 U.S.C. § 502; Fed. R. Bankr. P. 3001, 3007", confidence: "High" };
  }
  return { line, issue_type: "Motion / Pleading Requiring Research", element: "Legal standard / factual support", authority: "Authority to verify", confidence: "Medium" };
}
