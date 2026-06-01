"use client";

import { CreateProfileForm } from "@/components/create-profile-form";
import {
  productTypeToProfileVariant,
  productTypeToQrKind,
  type TagProductType,
} from "@/lib/inventory/types";
import { verifyTagActivationAction } from "@/app/actions/activate-tag";
import Link from "next/link";
import { useState } from "react";

type TagContext = {
  publicTagId: string;
  productLabel: string;
  productType: TagProductType | null;
  status: string;
  isActivatable: boolean;
  qrSlug: string | null;
};

type Props = {
  tag: TagContext;
  isLoggedIn: boolean;
  userEmail: string | null;
  loginNext: string;
};

type Step = "intro" | "code" | "profile" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "intro", label: "Login" },
  { id: "profile", label: "Profile" },
  { id: "done", label: "Done" },
];

function StepIndicator({ current }: { current: Step }) {
  const order: Step[] = ["intro", "code", "profile", "done"];
  const idx = order.indexOf(current);

  return (
    <ol className="flex items-center justify-between gap-2">
      {STEPS.map((s, i) => {
        const stepIdx = order.indexOf(s.id);
        const active = stepIdx === idx;
        const done = stepIdx < idx;
        return (
          <li key={s.id} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                active
                  ? "bg-qn-accent text-white"
                  : done
                    ? "bg-qn-accent/20 text-qn-accent"
                    : "bg-white/[0.06] text-qn-muted-2"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide ${
                active ? "text-white" : "text-qn-muted-2"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function PhysicalTagActivation({ tag, isLoggedIn, userEmail, loginNext }: Props) {
  const [step, setStep] = useState<Step>("intro");
  const [activationCode, setActivationCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [activatedSlug, setActivatedSlug] = useState<string | null>(null);

  const isActivated = tag.status === "activated";

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setVerifyError(null);
    setVerifying(true);
    const result = await verifyTagActivationAction(tag.publicTagId, activationCode);
    setVerifying(false);
    if (result.error) {
      setVerifyError(result.error);
      return;
    }
    setStep("profile");
  }

  if (isActivated) {
    return (
      <div className="qn-card p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
          Tag already active
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
          {tag.publicTagId}
        </h1>
        <p className="mt-3 text-sm text-qn-muted">{tag.productLabel}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/dashboard/tags" className="qn-btn-primary w-full">
            Go to My Tags
          </Link>
          {tag.qrSlug ? (
            <Link href={`/s/${tag.qrSlug}`} className="qn-btn-secondary w-full">
              View public scan page
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  if (tag.status === "locked" || tag.status === "disabled") {
    return (
      <div className="qn-card p-6 text-center sm:p-8">
        <h1 className="text-xl font-bold text-white">This tag is currently unavailable</h1>
        <p className="mt-3 text-sm text-qn-muted">
          Contact QRNetra support if you need help with tag {tag.publicTagId}.
        </p>
        <Link href="/contact" className="qn-btn-secondary mt-6 inline-flex">
          Contact support
        </Link>
      </div>
    );
  }

  const qrKind = productTypeToQrKind(tag.productType ?? undefined);
  const profileVariant = productTypeToProfileVariant(tag.productType ?? undefined);

  if (step === "done") {
    return (
      <div className="space-y-6">
        <div className="qn-card p-5 sm:p-6">
          <StepIndicator current="done" />
        </div>
        <div className="qn-card p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
            Activation complete
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-white">
            {tag.publicTagId} is live
          </h1>
          <p className="mt-3 text-sm text-qn-muted">
            Your {tag.productLabel} is linked to your account. Finders can scan your
            tag to reach your emergency profile.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/dashboard/tags" className="qn-btn-primary w-full">
              Go to My Tags
            </Link>
            {activatedSlug ? (
              <Link href={`/s/${activatedSlug}`} className="qn-btn-secondary w-full">
                Preview public scan page
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="qn-card p-5 sm:p-6">
        <StepIndicator current={step} />
      </div>

      <div className="qn-card p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
          Activate physical tag
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">{tag.productLabel}</h1>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-qn-muted">Tag ID</dt>
            <dd className="font-mono font-medium text-white">{tag.publicTagId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-qn-muted">Status</dt>
            <dd className="capitalize text-white">{tag.status.replace(/_/g, " ")}</dd>
          </div>
        </dl>
      </div>

      {step === "intro" && (
        <div className="qn-card p-5 sm:p-6">
          <p className="text-sm text-qn-muted">
            Enter the activation code printed on your product packaging to link this tag
            to your account.
          </p>
          {!isLoggedIn ? (
            <Link
              href={`/login?next=${encodeURIComponent(loginNext)}`}
              className="qn-btn-primary mt-6 w-full"
            >
              Sign in to activate
            </Link>
          ) : (
            <button
              type="button"
              className="qn-btn-primary mt-6 w-full"
              onClick={() => setStep("code")}
            >
              Enter activation code
            </button>
          )}
        </div>
      )}

      {step === "code" && isLoggedIn && (
        <div className="qn-card p-5 sm:p-6">
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-white">Activation code</span>
              <input
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="e.g. 8K2P4M"
                className="qn-input mt-2 w-full font-mono uppercase"
                autoComplete="off"
                required
              />
            </label>
            <p className="text-xs text-qn-muted">
              Found on the card inside your package, next to Tag ID {tag.publicTagId}.
            </p>
            {verifyError ? <p className="text-sm text-qn-warning">{verifyError}</p> : null}
            <button type="submit" className="qn-btn-primary w-full" disabled={verifying}>
              {verifying ? "Verifying…" : "Verify and continue"}
            </button>
            <button
              type="button"
              className="qn-btn-ghost w-full text-sm"
              onClick={() => setStep("intro")}
            >
              Back
            </button>
          </form>
        </div>
      )}

      {step === "profile" && isLoggedIn && activationCode && (
        <CreateProfileForm
          initialType={qrKind}
          initialEmail={userEmail}
          activationCode={activationCode}
          publicTagId={tag.publicTagId}
          flow="activate"
          productVariant={profileVariant}
          lockType
          headerBadge="Complete your profile"
          headerTitle="Almost done"
          headerDescription="Fill in your emergency details. This information is shown when someone scans your tag."
          onCreated={({ slug }) => {
            setActivatedSlug(slug);
            setStep("done");
          }}
        />
      )}
    </div>
  );
}
