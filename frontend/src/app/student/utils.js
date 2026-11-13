export const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// MySQL TIME ("09:00:00") to "9:00 AM"
export const formatTime = (value) => {
  if (!value) return "-";
  const [h, m] = String(value).split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const fullName = (first, last) => [first, last].filter(Boolean).join(" ");
