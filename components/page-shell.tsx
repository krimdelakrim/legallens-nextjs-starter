import { Nav } from "./nav";

export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="mt-6">{children}</div>
      </main>
    </>
  );
}
