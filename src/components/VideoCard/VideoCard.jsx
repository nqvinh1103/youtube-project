import { Link } from "react-router-dom";
import "../../pages/Homepage/Homepage.css";
import { formatDuration, formatViewCount } from "../../utils/videoUtils";
const VideoCard = ({ id, snippet, statistics, contentDetails, channelMap }) => {
  const videoId = id?.videoId || id;
  const videoDuration = contentDetails?.duration
    ? formatDuration(contentDetails.duration)
    : "10:00";

  // Lấy channel avatar từ channelMap hoặc fallback về video thumbnail
  const channelId = snippet?.channelId;
  const channelAvatar =
    channelMap?.[channelId]?.thumbnail ||
    channelMap?.[channelId]?.mediumThumbnail ||
    snippet?.thumbnails?.default?.url;

  return (
    <Link
      to={`/watch/${videoId}`}
      className="youtube-video"
      aria-label={snippet?.title}
    >
      <div className="youtube-thumbnail">
        <img
          className="youtube-thumbnailPic"
          src={snippet?.thumbnails?.medium?.url}
          alt={snippet?.title}
        />
        <div className="youtube-thumbnailTime">{videoDuration}</div>
      </div>
      <div className="youtube-titleBox">
        <div className="youtube-titleProfile">
          <img
            className="youtube-thumbnailProfile"
            src={channelAvatar}
            alt={snippet?.channelTitle}
          />
        </div>
        <div className="youtube-titleBoxProfile">
          <div className="youtube-videoTitle">{snippet?.title}</div>
          <div className="youtube-channelName">{snippet?.channelTitle}</div>
          <div className="youtube-videoView">
            {formatViewCount(statistics?.viewCount)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
