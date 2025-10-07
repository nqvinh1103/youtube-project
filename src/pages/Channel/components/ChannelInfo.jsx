import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChannelInfo = () => {
  const { id: channelId } = useParams();
  const channelInfo = useSelector(
    (state) => state.channels.channels?.[channelId]
  );

  const title = channelInfo?.title || "Channel";
  const avatar =
    channelInfo?.highThumbnail ||
    channelInfo?.mediumThumbnail ||
    channelInfo?.thumbnail ||
    "https://placehold.co/160x160?text=Channel";
  const subscribers = channelInfo?.subscriberCount
    ? `• ${Number(channelInfo.subscriberCount).toLocaleString()} người đăng ký`
    : "";
  const videoCount = channelInfo?.videoCount
    ? `• ${Number(channelInfo.videoCount).toLocaleString()} video`
    : "";
  const description = channelInfo?.description || "";
  const handle = channelInfo?.title
    ? `@${channelInfo.title.replace(/\s+/g, "")}`
    : "";

  return (
    <div className="channel-info">
      <div className="channel-avatar">
        <img src={avatar} alt={title} className="avatar-image" />
      </div>

      <div className="channel-details">
        <div className="channel-title">
          <h3 className="channel-name">{title}</h3>
          <div className="verified-badge">✓</div>
        </div>

        <div className="channel-stats">
          <div className="channel-handle">{handle}</div>
          <div className="channel-subscribers">{subscribers}</div>
          <div className="channel-video-count">{videoCount}</div>
        </div>

        {description && (
          <div className="channel-description">
            {description} <span className="see-more">xem thêm</span>
          </div>
        )}

        <div className="channel-links">
          <a
            href={`https://youtube.com/channel/${channelId}`}
            target="_blank"
            rel="noreferrer"
            className="channel-link"
          >
            youtube.com/channel/{channelId}
          </a>
        </div>
        <div className="channel-actions">
          <button className="action-button registered">
            <span className="bell-icon">🔔</span>
            Đã đăng ký
            <span>▼</span>
          </button>
          <button className="action-button join">Tham gia</button>
        </div>
      </div>
    </div>
  );
};

export default ChannelInfo;
