import React from "react";
import { communityPosts } from "../mockData";

const PostContent = () => {
  return (
    <div className="community-posts-container">
      {communityPosts.map((post, index) => (
        <div key={index} className="community-post">
          <div className="post-header">
            <img
              src={post.avatar}
              alt="Chisgule Gaming"
              className="post-avatar"
            />
            <div className="post-meta">
              <span className="post-author">Chisgule Gaming</span>
              <span className="post-time">• {post.timeAgo}</span>
            </div>
            <div className="post-options">
              <span className="options-icon">⋮</span>
            </div>
          </div>

          <div className="post-content">
            {post.content && <p className="post-text">{post.content}</p>}

            {post.link && (
              <a
                href={post.link}
                className="post-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.link}
              </a>
            )}

            {post.image && (
              <div className="post-image-container">
                <img
                  src={post.image}
                  alt="Post content"
                  className="post-image"
                />
              </div>
            )}

            {post.poll && (
              <div className="poll-section">
                <div className="poll-question">{post.poll.question}</div>
                <div className="poll-votes">{post.poll.votes}</div>
                <div className="poll-options">
                  {post.poll.options.map((option, optionIndex) => (
                    <button key={optionIndex} className="poll-option">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="post-engagement">
            <div className="engagement-item">
              <span className="engagement-icon">👍</span>
              <span className="engagement-count">{post.likes}</span>
            </div>
            <div className="engagement-item">
              <span className="engagement-icon">👎</span>
            </div>
            <div className="engagement-item">
              <span className="engagement-icon">📤</span>
            </div>
            <div className="engagement-item">
              <span className="engagement-icon">💬</span>
              <span className="engagement-count">{post.comments}</span>
            </div>
            <div className="engagement-item">
              <span className="engagement-icon">⋮</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostContent;
