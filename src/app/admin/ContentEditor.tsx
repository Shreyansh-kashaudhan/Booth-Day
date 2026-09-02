"use client";

import type { Catalog } from "@/lib/catalog";
import { useState } from "react";

type Tab = "wordle" | "dingbats" | "perfect10" | "bot";

export function ContentEditor({ initial }: { initial: Catalog }) {
  const [tab, setTab] = useState<Tab>("wordle");
  const [catalog, setCatalog] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(method: string, body: object) {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/admin/catalog", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error ?? "Save failed");
      return;
    }
    setCatalog(data);
    setMessage("Saved.");
  }

  return (
    <section className="card-panel p-5">
      <h2 className="font-display text-2xl">Question bank</h2>
      <p className="mt-1 text-sm text-cream/60">View, add, edit, or delete the booth content. Games pick from this list.</p>
      {message ? <p className="mt-2 text-ticket">{message}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["wordle", "Word Battle"],
            ["dingbats", "Dingbats"],
            ["perfect10", "Perfect 10"],
            ["bot", "Bot or Not"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={`arcade-chip ${tab === id ? "arcade-chip-on" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "wordle" ? <WordsPanel catalog={catalog} busy={busy} send={send} /> : null}
        {tab === "dingbats" ? <DingbatsPanel catalog={catalog} busy={busy} send={send} /> : null}
        {tab === "perfect10" ? <PerfectPanel catalog={catalog} busy={busy} send={send} /> : null}
        {tab === "bot" ? <BotsPanel catalog={catalog} busy={busy} send={send} /> : null}
      </div>
    </section>
  );
}

function WordsPanel({
  catalog,
  busy,
  send,
}: {
  catalog: Catalog;
  busy: boolean;
  send: (method: string, body: object) => Promise<void>;
}) {
  const [word, setWord] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("security");

  return (
    <div className="space-y-4">
      <form
        className="grid gap-2 sm:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          send("POST", { kind: "word", word, difficulty, category }).then(() => setWord(""));
        }}
      >
        <input className="arcade-input sm:col-span-2" placeholder="BLOCK" value={word} onChange={(e) => setWord(e.target.value)} />
        <input className="arcade-input" placeholder="easy" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
        <button className="arcade-btn arcade-btn-cyan py-2" type="submit" disabled={busy}>
          Add word
        </button>
      </form>
      <input className="arcade-input" placeholder="category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <ul className="max-h-[480px] space-y-2 overflow-auto">
        {catalog.words.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-black/25 p-2">
            <input
              className="arcade-input w-28"
              defaultValue={row.word}
              onBlur={(e) => {
                const next = e.target.value.toUpperCase();
                if (next && next !== row.word) send("PATCH", { kind: "word", id: row.id, word: next, difficulty: row.difficulty, category: row.category });
              }}
            />
            <span className="text-xs text-cream/50">{row.difficulty}</span>
            <button
              className="ml-auto text-xs uppercase tracking-widest text-magenta"
              type="button"
              onClick={() => {
                if (confirm(`Delete ${row.word}?`)) send("DELETE", { kind: "word", id: row.id });
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DingbatsPanel({
  catalog,
  busy,
  send,
}: {
  catalog: Catalog;
  busy: boolean;
  send: (method: string, body: object) => Promise<void>;
}) {
  const [draft, setDraft] = useState({
    set: "harness",
    content: "",
    answer: "",
    acceptedAnswers: "",
    hint: "",
    display: "emoji",
  });

  return (
    <div className="space-y-6">
      <form
        className="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send("POST", { kind: "dingbat", ...draft }).then(() =>
            setDraft({ set: "harness", content: "", answer: "", acceptedAnswers: "", hint: "", display: "emoji" }),
          );
        }}
      >
        <textarea className="arcade-input min-h-20" placeholder="👉  🚢  ✅" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
        <input className="arcade-input" placeholder="Answer: GET SHIP DONE" value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
        <input className="arcade-input" placeholder="Other accepted answers, comma separated" value={draft.acceptedAnswers} onChange={(e) => setDraft({ ...draft, acceptedAnswers: e.target.value })} />
        <input className="arcade-input" placeholder="Hint" value={draft.hint} onChange={(e) => setDraft({ ...draft, hint: e.target.value })} />
        <div className="flex gap-2">
          <select className="arcade-input" value={draft.set} onChange={(e) => setDraft({ ...draft, set: e.target.value })}>
            <option value="harness">harness</option>
            <option value="api-protection">api-protection</option>
            <option value="classic">classic</option>
          </select>
          <button className="arcade-btn arcade-btn-cyan px-4" type="submit" disabled={busy}>
            Add puzzle
          </button>
        </div>
      </form>
      <ul className="max-h-[520px] space-y-3 overflow-auto">
        {catalog.dingbats.map((row) => (
          <li key={row.id} className="space-y-2 rounded-lg bg-black/25 p-3">
            <p className="text-xs uppercase tracking-widest text-cyan">{row.set}</p>
            <textarea
              className="arcade-input min-h-16 w-full"
              defaultValue={row.content}
              onBlur={(e) => {
                if (e.target.value !== row.content) send("PATCH", { kind: "dingbat", ...row, id: row.id, content: e.target.value, acceptedAnswers: row.acceptedAnswers?.join(", ") });
              }}
            />
            <input
              className="arcade-input w-full"
              defaultValue={row.answer}
              onBlur={(e) => {
                if (e.target.value !== row.answer) send("PATCH", { kind: "dingbat", ...row, id: row.id, answer: e.target.value, acceptedAnswers: row.acceptedAnswers?.join(", ") });
              }}
            />
            <input
              className="arcade-input w-full"
              defaultValue={row.hint ?? ""}
              placeholder="Hint"
              onBlur={(e) => {
                if (e.target.value !== (row.hint ?? "")) send("PATCH", { kind: "dingbat", ...row, id: row.id, hint: e.target.value, acceptedAnswers: row.acceptedAnswers?.join(", ") });
              }}
            />
            <button
              className="text-xs uppercase tracking-widest text-magenta"
              type="button"
              onClick={() => {
                if (confirm("Delete this puzzle?")) send("DELETE", { kind: "dingbat", id: row.id });
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PerfectPanel({
  catalog,
  busy,
  send,
}: {
  catalog: Catalog;
  busy: boolean;
  send: (method: string, body: object) => Promise<void>;
}) {
  const [target, setTarget] = useState(String(catalog.perfect10.targetSeconds));
  const [attempts, setAttempts] = useState(String(catalog.perfect10.attempts));
  return (
    <form
      className="grid max-w-sm gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        send("POST", { kind: "perfect10", targetSeconds: Number(target), attempts: Number(attempts) });
      }}
    >
      <label className="text-sm">
        Target seconds
        <input className="arcade-input mt-1 w-full" value={target} onChange={(e) => setTarget(e.target.value)} />
      </label>
      <label className="text-sm">
        Tries
        <input className="arcade-input mt-1 w-full" value={attempts} onChange={(e) => setAttempts(e.target.value)} />
      </label>
      <button className="arcade-btn arcade-btn-gold py-2" type="submit" disabled={busy}>
        Save Perfect 10
      </button>
    </form>
  );
}

function BotsPanel({
  catalog,
  busy,
  send,
}: {
  catalog: Catalog;
  busy: boolean;
  send: (method: string, body: object) => Promise<void>;
}) {
  const blankFacts = '[\n  {"label": "Endpoint", "value": "POST /login"},\n  {"label": "Requests", "value": "100 / minute"}\n]';
  const [draft, setDraft] = useState({
    title: "",
    facts: blankFacts,
    answer: "bot",
    explanation: "",
  });

  return (
    <div className="space-y-6">
      <form
        className="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send("POST", { kind: "bot", ...draft }).then(() => setDraft({ title: "", facts: blankFacts, answer: "bot", explanation: "" }));
        }}
      >
        <input className="arcade-input" placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <textarea className="arcade-input min-h-32 font-mono text-sm" value={draft.facts} onChange={(e) => setDraft({ ...draft, facts: e.target.value })} />
        <select className="arcade-input" value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })}>
          <option value="bot">bot</option>
          <option value="human">human</option>
        </select>
        <input className="arcade-input" placeholder="Explanation" value={draft.explanation} onChange={(e) => setDraft({ ...draft, explanation: e.target.value })} />
        <button className="arcade-btn arcade-btn-cyan py-2" type="submit" disabled={busy}>
          Add scenario
        </button>
      </form>
      <ul className="max-h-[520px] space-y-3 overflow-auto">
        {catalog.bots.map((row) => (
          <li key={row.id} className="space-y-2 rounded-lg bg-black/25 p-3">
            <input
              className="arcade-input w-full"
              defaultValue={row.title}
              onBlur={(e) => {
                if (e.target.value !== row.title) {
                  send("PATCH", {
                    kind: "bot",
                    id: row.id,
                    title: e.target.value,
                    facts: JSON.stringify(row.facts),
                    answer: row.answer,
                    explanation: row.explanation,
                  });
                }
              }}
            />
            <p className="font-mono text-xs text-cyan">{row.answer.toUpperCase()}</p>
            <pre className="overflow-auto text-xs text-cream/70">{JSON.stringify(row.facts, null, 2)}</pre>
            <textarea
              className="arcade-input min-h-20 w-full font-mono text-xs"
              defaultValue={JSON.stringify(row.facts, null, 2)}
              onBlur={(e) => {
                send("PATCH", {
                  kind: "bot",
                  id: row.id,
                  title: row.title,
                  facts: e.target.value,
                  answer: row.answer,
                  explanation: row.explanation,
                });
              }}
            />
            <select
              className="arcade-input"
              defaultValue={row.answer}
              onChange={(e) =>
                send("PATCH", {
                  kind: "bot",
                  id: row.id,
                  title: row.title,
                  facts: JSON.stringify(row.facts),
                  answer: e.target.value,
                  explanation: row.explanation,
                })
              }
            >
              <option value="bot">bot</option>
              <option value="human">human</option>
            </select>
            <button
              className="text-xs uppercase tracking-widest text-magenta"
              type="button"
              onClick={() => {
                if (confirm(`Delete ${row.title}?`)) send("DELETE", { kind: "bot", id: row.id });
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
