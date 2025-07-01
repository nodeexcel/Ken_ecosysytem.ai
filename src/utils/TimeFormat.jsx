export function DateFormat(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
}

export function formatTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = (now - time) / 1000; // in seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;

  // Check if it was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (
    time.getDate() === yesterday.getDate() &&
    time.getMonth() === yesterday.getMonth() &&
    time.getFullYear() === yesterday.getFullYear()
  ) {
    return "yesterday";
  }

  // Return formatted date (e.g., Jun 29, 2025)
  return time.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

