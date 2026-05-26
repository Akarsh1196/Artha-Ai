export default function TaxAdvisor() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">Tax Advisor</h1>
        <p className="mt-2 text-text-muted dark:text-text-muted-dark">
          Tax planning tools are not implemented yet, but this route now stays stable and communicates that clearly.
        </p>
      </div>

      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Planned Coverage</h2>
        <p className="mt-3 text-sm text-text-muted dark:text-text-muted-dark">
          Future work here can include deduction guidance, old-vs-new regime comparisons, and filing reminders without breaking navigation today.
        </p>
      </div>
    </div>
  );
}
