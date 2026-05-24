"use client";

import { useState } from "react";

export function BusinessFleetQuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="qn-card p-8 text-center">
        <p className="text-lg font-semibold text-white">Request received</p>
        <p className="mt-2 text-sm text-qn-muted">
          Our team will reach out within one business day with tailored pricing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="qn-card space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className="qn-label">Organization name</span>
          <input name="organization" required className="qn-input" />
        </label>
        <label className="block sm:col-span-1">
          <span className="qn-label">Contact person</span>
          <input name="contact" required className="qn-input" />
        </label>
        <label className="block sm:col-span-1">
          <span className="qn-label">Work email</span>
          <input name="email" type="email" required className="qn-input" />
        </label>
        <label className="block sm:col-span-1">
          <span className="qn-label">Phone</span>
          <input name="phone" type="tel" required className="qn-input" />
        </label>
      </div>
      <label className="block">
        <span className="qn-label">Estimated quantity</span>
        <select name="quantity" className="qn-select" defaultValue="50-200">
          <option value="10-50">10 – 50 tags</option>
          <option value="50-200">50 – 200 tags</option>
          <option value="200-1000">200 – 1,000 tags</option>
          <option value="1000+">1,000+ tags</option>
        </select>
      </label>
      <label className="block">
        <span className="qn-label">Use case</span>
        <textarea
          name="message"
          rows={4}
          className="qn-textarea"
          placeholder="Fleet size, locations, branding needs…"
        />
      </label>
      <button type="submit" className="qn-btn-primary w-full sm:w-auto sm:px-10">
        Request Bulk Pricing
      </button>
    </form>
  );
}
