import Link from "next/link";

const links = [
  ["Dashboard", "/dashboard"], ["Cases", "/cases"], ["Upload", "/upload"], ["Intake Review", "/intake-review"],
  ["Significant Lines", "/significant-lines"], ["Analysis", "/application-analysis"], ["Precedent", "/precedent-library"],
  ["Memo", "/research-memo"], ["Filing", "/filing-draft"], ["Quality", "/quality-check"]
];

export function Nav() {
  return <nav className="flex flex-wrap gap-2 border-b bg-white p-3">{links.map(([label, href]) => <Link key={href} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100" href={href}>{label}</Link>)}</nav>;
}
