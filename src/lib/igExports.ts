import { supabase } from "@/integrations/supabase/client";
import { ADMIN_TOKEN_KEY } from "@/components/AdminGate";

export type IgExportSlide = { tpl?: string; values?: Record<string, unknown>; [k: string]: unknown };

export type IgExportPayload = {
  aspect?: string;
  topEndZone?: boolean;
  currentSlide?: number;
  bg?: string;
  theme?: string;
  slides?: IgExportSlide[];
  caption?: string | null;
};

export type IgExportEntry = {
  id: string;
  name: string;
  kind: string;
  slide_count: number;
  photos_dropped: boolean;
  created_at: string;
  updated_at: string;
  templates: string[] | null;
  aspect?: string | null;
  caption?: string | null;
  payload?: IgExportPayload;
};

export async function igExportsApi<T = unknown>(
  action: string,
  extra: Record<string, unknown> = {},
): Promise<T> {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) throw new Error("Ikke innlogget");
  const { data, error } = await supabase.functions.invoke("ig-exports", {
    body: { token, action, ...extra },
  });
  const status = (error as { context?: { status?: number } } | null)?.context?.status;
  if (status === 401 || (data as { error?: string } | null)?.error === "unauthorized") {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    window.location.reload();
    throw new Error("unauthorized");
  }
  if (error) throw new Error(error.message || "Nettverksfeil");
  const err = (data as { error?: string } | null)?.error;
  if (err) throw new Error(err);
  return data as T;
}

export const listIgExports = () =>
  igExportsApi<{ entries: IgExportEntry[] }>("list").then((r) => r.entries ?? []);

export const getIgExport = (id: string) =>
  igExportsApi<{ entry: IgExportEntry }>("get", { id }).then((r) => r.entry);

export const deleteIgExport = (id: string) => igExportsApi("delete", { id });

export const renameIgExport = (id: string, name: string) => igExportsApi("rename", { id, name });

export function slugifyFilename(name: string) {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "ig-post"
  );
}
