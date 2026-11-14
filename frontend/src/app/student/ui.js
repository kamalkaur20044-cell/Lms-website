import Icon from "@/components/Icon";

export function PageTitle({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 className="text-xl font-extrabold text-[#1a1a2e]">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, action, className = "", children }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {title && <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ label, value = "-", note = "Coming soon", color, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-white`}>
          <Icon d={icon} />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-[#1a1a2e]">{value}</p>
      <p className="text-xs text-gray-400">{note}</p>
    </div>
  );
}

export function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value || "-"}</p>
    </div>
  );
}

export function Tabs({ items, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors
            ${value === item ? "bg-[#C8102E] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 focus:border-[#C8102E]";
