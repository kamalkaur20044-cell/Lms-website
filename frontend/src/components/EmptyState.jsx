import Icon from "./Icon";

const INBOX =
  "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4";

export default function EmptyState({ title, message = "Nothing to show yet.", children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {title && <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">{title}</h2>}
      {children}
      <div className="flex flex-col items-center justify-center text-center py-6">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-gray-400">
          <Icon d={INBOX} />
        </div>
        <p className="text-xs text-gray-400">{message}</p>
      </div>
    </div>
  );
}
