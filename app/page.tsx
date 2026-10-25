import { Suspense } from "react";
import { connection } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

async function addNote(formData: FormData) {
  "use server";
  const text = String(formData.get("text") ?? "").trim();
  if (!text) return;
  const { error } = await supabaseAdmin().from("notes").insert({ text });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

async function Notes() {
  await connection();
  const { data: notes, error } = await supabaseAdmin()
    .from("notes")
    .select("id, text, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return <p className="text-red-600">Chyba: {error.message}</p>;
  return (
    <ul className="space-y-2">
      {notes?.map((n) => (
        <li key={n.id} className="rounded border p-3">
          {n.text}
          <span className="ml-2 text-xs text-gray-400">{new Date(n.created_at).toLocaleString("cs-CZ")}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold">demo-test</h1>
      <p className="mb-6 text-sm text-gray-500">Next.js + Supabase, bez přihlášení.</p>
      <form action={addNote} className="mb-6 flex gap-2">
        <input name="text" required placeholder="Napiš poznámku" className="flex-1 rounded border px-3 py-2" />
        <button className="rounded bg-black px-4 py-2 text-white">Uložit</button>
      </form>
      <Suspense fallback={<p className="text-gray-400">Načítám…</p>}>
        <Notes />
      </Suspense>
    </main>
  );
}
