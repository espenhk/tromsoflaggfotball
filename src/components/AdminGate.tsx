import { useState } from "react";
import { Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_TOKEN_KEY = "admin_token";

const AdminGate = () => {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem(ADMIN_TOKEN_KEY),
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("list-signups", {
        body: { password: input, action: "verify" },
      });
      if (error || !data?.ok || !data?.token) throw new Error("unauth");
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setAuthed(true);
    } catch {
      setError("Feil passord");
    } finally {
      setLoading(false);
    }
  };

  if (authed) return <Outlet />;

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="font-display text-3xl mb-6">Admin</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Passord"
            className="flex-1 rounded-md bg-card border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-5 py-2 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : "Logg inn"}
          </button>
        </div>
        {error && <p className="mt-3 text-destructive text-sm">{error}</p>}
      </form>
    </main>
  );
};

export default AdminGate;