// Utility functions for video data processing

// Format duration from ISO 8601 format (PT4M13S) to readable format (4:13)
export const formatDuration = (duration) => {
  if (!duration) return "0:00";

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
};

// Format view count
export const formatViewCount = (count) => {
  if (!count) return "0 lượt xem";
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M lượt xem`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K lượt xem`;
  }
  return `${num} lượt xem`;
};

// Format publish date
export const formatPublishDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} tuần trước`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} tháng trước`;
  } else {
    return `${Math.floor(diffDays / 365)} năm trước`;
  }
};
