export default function StatCard({ label, value, icon, colorClass }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg mb-3 ${colorClass}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}