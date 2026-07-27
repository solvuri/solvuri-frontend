// apps/web/components/shared/LegalPage.tsx
export interface LegalSection {
  heading: string;
  body: string;
}

export const LegalPage = ({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) => (
  <main className="bg-[#0F0E2A] min-h-screen pt-20">
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bebas text-white mb-8">{title}</h1>

      <div
        role="note"
        className="bg-[#C8D400]/10 border border-[#C8D400]/30 rounded-2xl px-6 py-5 mb-12"
      >
        <p className="text-[#C8D400] font-bold text-sm uppercase tracking-widest mb-2">
          Draft — pending legal review
        </p>
        <p className="text-[#E2E0FF] text-sm leading-relaxed">
          This page is placeholder text and is not yet in effect. It has not
          been reviewed by legal counsel and should not be relied on as
          Solvuri&apos;s actual policy. Contact{" "}
          <a href="mailto:hello@solvuri.com" className="underline">
            hello@solvuri.com
          </a>{" "}
          for our current terms.
        </p>
      </div>

      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold text-white mb-3">{s.heading}</h2>
            <p className="text-[#9896B8] leading-relaxed whitespace-pre-line">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  </main>
);
