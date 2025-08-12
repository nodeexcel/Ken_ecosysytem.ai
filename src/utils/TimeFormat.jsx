export function DateFormat(isoString) {
  if (!isoString) return '';
  
  try {
    // Create a date object from the ISO string
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', isoString);
      return '';
    }
    
    // Use toLocaleString for proper timezone handling
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Use local timezone
    };
    
    const formattedDate = date.toLocaleString('en-US', options);
    
    // Convert to the desired format: DD/MM/YYYY HH:MM AM/PM
    const parts = formattedDate.split(', ');
    if (parts.length !== 2) {
      // Fallback to manual formatting if toLocaleString doesn't work as expected
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
    
    const datePart = parts[0];
    const timePart = parts[1];
    
    // Reformat date from MM/DD/YYYY to DD/MM/YYYY
    const [month, day, year] = datePart.split('/');
    const formattedDatePart = `${day}/${month}/${year}`;
    
    return `${formattedDatePart} ${timePart}`;
  } catch (error) {
    console.error('Error formatting date:', error, isoString);
    return '';
  }
}

export function formatTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = (now - time) / 1000; // in seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;

  // Helper to format time as h:mm AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Today
  if (
    time.getDate() === now.getDate() &&
    time.getMonth() === now.getMonth() &&
    time.getFullYear() === now.getFullYear()
  ) {
    return `Today at ${formatTime(time)}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    time.getDate() === yesterday.getDate() &&
    time.getMonth() === yesterday.getMonth() &&
    time.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${formatTime(time)}`;
  }

  // Older: Jun 29, 2025 at 4:32 PM
  return `${time.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} at ${formatTime(time)}`;
}

export function UtcFormat(isoString) {
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

  return `${year}-${month}-${day}`;
}