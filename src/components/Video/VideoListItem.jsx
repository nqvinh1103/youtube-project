import { Link } from "react-router-dom";
import {
  formatDuration,
  formatPublishDate,
  formatViewCount,
} from "../../utils/videoUtils";
import "./VideoListItem.css";

const VideoListItem = ({
  // Props từ popular videos API
  id,
  snippet,
  statistics,
  contentDetails,

  // Props từ mock data (fallback)
  thumbnailUrl,
  duration,
  title,
  channelName,
  views,
  publishedAt,
  description,
  avatarUrl,
}) => {
  // Xử lý dữ liệu từ YouTube API
  const videoId = id?.videoId || id;
  const videoTitle = snippet?.title || title;
  const videoChannelName = snippet?.channelTitle || channelName;
  const videoThumbnail = snippet?.thumbnails?.medium?.url || thumbnailUrl;
  const videoAvatar = snippet?.thumbnails?.default?.url || avatarUrl;
  const videoDescription = snippet?.description || description;
  const videoDuration = contentDetails?.duration
    ? formatDuration(contentDetails.duration)
    : duration;

  const videoViews = statistics?.viewCount
    ? formatViewCount(statistics.viewCount)
    : views;
  const videoPublishedAt = snippet?.publishedAt
    ? formatPublishDate(snippet.publishedAt)
    : publishedAt;

  return (
    <div className="vlist-item">
      <Link
        to={`/watch/${videoId}`}
        className="vlist-thumb"
        aria-label={videoTitle}
      >
        <img className="vlist-thumbImg" src={videoThumbnail} alt={videoTitle} />
        {videoDuration && <div className="vlist-duration">{videoDuration}</div>}
      </Link>
      <div className="vlist-meta">
        <Link
          to={`/watch/${videoId}`}
          className="vlist-title"
          style={{ color: "white" }}
        >
          {videoTitle}
        </Link>
        <div className="vlist-sub">
          <img
            className="vlist-avatar"
            src={videoAvatar}
            alt={videoChannelName}
          />
          <div className="vlist-subText">
            <div className="vlist-channel">{videoChannelName}</div>
            <div className="vlist-stats">
              {videoViews} • {videoPublishedAt}
            </div>
          </div>
        </div>
        {videoDescription && (
          <div className="vlist-desc">{videoDescription}</div>
        )}
      </div>
    </div>
  );
};

export default VideoListItem;
