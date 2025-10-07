import React from "react";
import { liveVideoList } from "../mockData";

const LiveVideoContent = ({ liveVideoSort, onSortChange }) => {
  return (
    <>
      {/* Live Video Sorting Buttons */}
      <div className="video-sorting">
        <button
          className={`sort-button ${
            liveVideoSort === "latest" ? "active" : ""
          }`}
          onClick={() => onSortChange("latest")}
        >
          Latest
        </button>
        <button
          className={`sort-button ${
            liveVideoSort === "popular" ? "active" : ""
          }`}
          onClick={() => onSortChange("popular")}
        >
          Popular
        </button>
        <button
          className={`sort-button ${
            liveVideoSort === "oldest" ? "active" : ""
          }`}
          onClick={() => onSortChange("oldest")}
        >
          Oldest
        </button>
      </div>

      {/* Live Video Grid */}
      <div className="video-grid">
        {liveVideoList.map((video, index) => (
          <div key={index} className="video-card">
            <div className="video-thumbnail">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="thumbnail-image"
              />
              <div className="video-duration live-indicator">
                <div className="live-dot"></div>
                <span>{video.viewers} watching</span>
              </div>
            </div>
            <div className="video-info">
              <h4 className="video-title">{video.title}</h4>
              <div className="video-meta">
                {video.viewers} watching • {video.timeAgo}
              </div>
              {video.tag && <div className="video-tag">{video.tag}</div>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LiveVideoContent;
