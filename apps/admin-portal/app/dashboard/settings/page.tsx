"use client";

import { useState } from "react";
import { Button, Input } from "@repo/ui";

const MODULES = [
  { key: "clearrack", label: "ClearRack" },
  { key: "safyri", label: "Safyri" },
  { key: "reservr", label: "Reservr" },
  { key: "master", label: "Master" },
] as const;

export default function PlatformSettingsPage() {
  const [siteName, setSiteName] = useState("Solvuri");
  const [supportEmail, setSupportEmail] = useState("support@solvuri.com");
  const [enabledModules, setEnabledModules] = useState<
    Record<string, boolean>
  >({ clearrack: true, safyri: true, reservr: true, master: true });
  const [savedNote, setSavedNote] = useState(false);

  const toggleModule = (key: string) => {
    setEnabledModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNote(true);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-4xl font-bebas text-text mb-4">
        Platform Settings
      </h1>

      <div className="bg-accent/10 border border-accent/30 rounded-2xl px-6 py-4 mb-8">
        <p className="text-accent text-sm">
          These settings are illustrative only — changes stay in this browser
          tab and don&apos;t persist yet. They&apos;ll write to a real
          settings API once one exists.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        <section>
          <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
            Platform Branding
          </h2>
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <Input
              label="Support Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-widest text-muted mb-4">
            Modules
          </h2>
          <div className="bg-surface rounded-2xl border border-primary/10 divide-y divide-input-bg">
            {MODULES.map((mod) => (
              <div
                key={mod.key}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="text-text font-medium">{mod.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabledModules[mod.key]}
                  aria-label={`Toggle ${mod.label}`}
                  onClick={() => toggleModule(mod.key)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    enabledModules[mod.key] ? "bg-primary" : "bg-inputBg"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      enabledModules[mod.key]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4">
          <Button type="submit" variant="accent">
            Save Changes
          </Button>
          {savedNote && (
            <span className="text-muted text-sm">
              Saved locally — not yet persisted anywhere.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
