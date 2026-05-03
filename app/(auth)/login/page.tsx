import { signIn, signUp } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Private access required.</p>
        {searchParams?.error ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{searchParams.error}</p> : null}
        <form className="mt-6 space-y-3">
          <input className="w-full rounded-xl border p-3" name="email" type="email" placeholder="Email" required />
          <input className="w-full rounded-xl border p-3" name="password" type="password" placeholder="Password" required />
          <div className="grid grid-cols-2 gap-3">
            <button formAction={signIn} className="rounded-xl bg-slate-900 p-3 text-white">Sign in</button>
            <button formAction={signUp} className="rounded-xl border p-3">Create account</button>
          </div>
        </form>
      </div>
    </main>
  );
}
