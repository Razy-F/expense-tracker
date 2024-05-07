export function formatDate(timestamp: string) {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
