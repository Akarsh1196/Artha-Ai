export default function Investments() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">Investments</h1>
        <p className="mt-2 text-text-muted dark:text-text-muted-dark">
          Investment tracking is being prepared. The rest of your dashboard and score data will keep working normally.
        </p>
      </div>

      <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark">Coming Next</h2>
        <p className="mt-3 text-sm text-text-muted dark:text-text-muted-dark">
          This area is reserved for portfolio summaries, SIP tracking, and allocation insights. It now has a safe placeholder so navigation does not dead-end.
        </p>
      </div>
    </div>
  );
}
