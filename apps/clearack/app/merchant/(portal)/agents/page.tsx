"use client";

import { useState } from "react";
import { Lucide } from "@repo/ui";
import {
  useAgents,
  registerAgent,
  deactivateAgent,
  reactivateAgent,
} from "@/lib/merchantApi";

const { CheckCircle2, XCircle } = Lucide;

const EMPTY_FORM = {
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  agentCode: "",
};

export default function MerchantAgentsPage() {
  const { data: agents, isLoading, refetch } = useAgents();

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<Record<number, string>>({});
  const [actionSubmitting, setActionSubmitting] = useState<
    Record<number, boolean>
  >({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    try {
      await registerAgent(form);
      setForm(EMPTY_FORM);
      await refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (agentId: number, isActive: boolean) => {
    setActionError((prev) => ({ ...prev, [agentId]: "" }));
    setActionSubmitting((prev) => ({ ...prev, [agentId]: true }));
    try {
      if (isActive) {
        await deactivateAgent(agentId);
      } else {
        await reactivateAgent(agentId);
      }
      await refetch();
    } catch (err) {
      setActionError((prev) => ({
        ...prev,
        [agentId]:
          err instanceof Error ? err.message : "Couldn't update this agent.",
      }));
    } finally {
      setActionSubmitting((prev) => ({ ...prev, [agentId]: false }));
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-black text-zinc-900 mb-1">Staff</h2>
      <p className="text-sm text-zinc-500 mb-6">
        Register cashier/agent logins for your team. Agents can run the POS
        till but never see cost price, profit, or management reports.
      </p>

      <div className="bg-white border rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-sm text-zinc-900 mb-4">
          Registered Staff
        </h3>
        {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}
        {!isLoading && (!agents || agents.length === 0) && (
          <p className="text-sm text-zinc-500">
            No staff registered yet — add one below.
          </p>
        )}
        {!isLoading && agents && agents.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-400 uppercase text-xs tracking-widest border-b">
                <th className="pb-2 font-medium">Username</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Agent Code</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b last:border-0">
                  <td className="py-3 text-zinc-900">{agent.username}</td>
                  <td className="py-3 text-zinc-500">{agent.email}</td>
                  <td className="py-3 text-zinc-500">{agent.agentCode}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold ${
                        agent.isActive ? "text-emerald-600" : "text-zinc-400"
                      }`}
                    >
                      {agent.isActive ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {agent.isActive ? "Active" : "Deactivated"}
                    </span>
                    {actionError[agent.id] && (
                      <p className="text-xs text-red-600 mt-1">
                        {actionError[agent.id]}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      disabled={actionSubmitting[agent.id]}
                      onClick={() =>
                        handleToggleActive(agent.id, agent.isActive)
                      }
                      className="text-blue-700 text-xs font-bold underline disabled:opacity-50"
                    >
                      {agent.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl p-6 space-y-4"
      >
        <h3 className="font-bold text-sm text-zinc-900 mb-2">
          Register New Staff
        </h3>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            USERNAME
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            EMAIL
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            PHONE NUMBER
          </label>
          <input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            TEMPORARY PASSWORD
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
          <p className="text-xs text-zinc-400 mt-1">
            No welcome email is sent — you&apos;ll need to hand this to your
            staff member yourself.
          </p>
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            AGENT CODE
          </label>
          <input
            type="text"
            value={form.agentCode}
            onChange={(e) => setForm({ ...form, agentCode: e.target.value })}
            placeholder="AGT-001"
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registering..." : "Register Staff"}
        </button>
      </form>
    </div>
  );
}
