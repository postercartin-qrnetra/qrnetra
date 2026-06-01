"use client";

import { useState } from "react";
import { submitContactFormAction } from "@/app/actions/support";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await submitContactFormAction({ name, email, subject, message });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-6 text-sm text-green-200">
        Thank you. We received your message and will respond to {email} as soon as we can.
      </p>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="qn-card space-y-4 p-6">
      <div>
        <label className="block text-sm font-medium text-white">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">Subject</label>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full resize-y rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 text-white"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button type="submit" disabled={loading} className="qn-btn-primary w-full">
        {loading ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
