import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import VideoListItem from "../../components/Video/VideoListItem";
import {
  clearComments,
  fetchVideoComments,
} from "../../redux/slices/commentSlice";
import {
  clearRelatedVideos,
  fetchRelatedVideos,
} from "../../redux/slices/relatedSlice";
import {
  clearCurrentVideo,
  fetchVideoDetail,
} from "../../redux/slices/videoSlice";
import { formatPublishDate, formatViewCount } from "../../utils/videoUtils";
import "./Watch.css";

const Watch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy state từ Redux
  const { currentVideo, detailLoading, detailError } = useSelector(
    (state) => state.videos
  );
  const {
    items: relatedVideos,
    loading: relatedLoading,
    error: relatedError,
  } = useSelector((state) => state.related);
  const {
    items: comments,
    loading: commentsLoading,
    error: commentsError,
  } = useSelector((state) => state.comments);

  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchVideoDetail({ videoId: id }));
      dispatch(fetchRelatedVideos({ videoId: id }));
      dispatch(fetchVideoComments({ videoId: id }));
    }

    return () => {
      dispatch(clearCurrentVideo());
      dispatch(clearRelatedVideos());
      dispatch(clearComments());
    };
  }, [dispatch, id]);

  const formatComments = (comments) => {
    if (!comments || comments.length === 0) return [];

    return comments.map((comment) => {
      const snippet =
        comment.snippet?.topLevelComment?.snippet || comment.snippet;
      return {
        id: comment.id,
        avatar:
          snippet?.authorProfileImageUrl ||
          `https://i.pravatar.cc/64?img=${Math.floor(Math.random() * 70) + 1}`,
        author: snippet?.authorDisplayName || "Anonymous",
        time: formatPublishDate(snippet?.publishedAt),
        text:
          snippet?.textDisplay || snippet?.textOriginal || "No comment text",
        likes: snippet?.likeCount || 0,
        replies: comment.snippet?.totalReplyCount || 0,
      };
    });
  };

  const displayComments = formatComments(comments);

  // Loading state
  if (detailLoading) {
    return (
      <div className="watchPage">
        <div className="loading-container">
          <h2>Đang tải video...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError) {
    return (
      <div className="watchPage">
        <div className="error-container">
          <h2>Lỗi tải video: {detailError}</h2>
        </div>
      </div>
    );
  }

  // No video found
  if (!currentVideo) {
    return (
      <div className="watchPage">
        <div className="error-container">
          <h2>Không tìm thấy video</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`watchPage`}>
      <div className="watchLayout">
        {/* Video Player */}
        <div className="watchMain">
          <div className="watchPlayer">
            <iframe
              className="watchIframe"
              src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
              title={currentVideo.snippet?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="watchMeta">
            <div className="watchTitle">{currentVideo.snippet?.title}</div>
            <div className="watchSub">
              <div className="watchChannel">
                <img
                  className="watchAvatar"
                  src={currentVideo.snippet?.thumbnails?.default?.url}
                  alt={currentVideo.snippet?.channelTitle}
                  onClick={() =>
                    navigate(`/channel/${currentVideo.snippet?.channelId}`)
                  }
                />
                <div className="watchChannelInfo">
                  <div className="watchChannelName">
                    {currentVideo.snippet?.channelTitle}
                  </div>
                  <div className="watchStats">
                    {formatViewCount(currentVideo.statistics?.viewCount)} •{" "}
                    {formatPublishDate(currentVideo.snippet?.publishedAt)}
                  </div>
                </div>
                <button className="watchBtn watchSubscribe">Đăng ký</button>
              </div>
              <div className="watchActions">
                <div className="watchLikeGroup">
                  <button className="watchBtn">
                    👍 {formatViewCount(currentVideo.statistics?.likeCount)}
                  </button>
                  <div className="watchDivider" />
                  <button className="watchBtn">👎</button>
                </div>
                <button className="watchBtn">Chia sẻ</button>
                <button className="watchBtn">Lưu</button>
                <button className="watchBtn">•••</button>
              </div>
            </div>
            <div className={`watchDescBox ${descExpanded ? "expanded" : ""}`}>
              <div className="watchDescHeader">
                {formatViewCount(currentVideo.statistics?.viewCount)} •{" "}
                {formatPublishDate(currentVideo.snippet?.publishedAt)}
              </div>
              <div className="watchDescText">
                {currentVideo.snippet?.description}
              </div>
              <button
                className="watchDescToggle"
                onClick={() => setDescExpanded((v) => !v)}
              >
                {descExpanded ? "Ẩn bớt" : "Thêm"}
              </button>
            </div>

            <div className="watchComments">
              <div className="watchCommentsHeader">
                {commentsLoading
                  ? "Đang tải bình luận..."
                  : `${displayComments.length} bình luận`}
                <span className="watchSort">Sắp xếp theo</span>
              </div>

              {commentsError && (
                <div style={{ color: "red", padding: "10px" }}>
                  Lỗi tải bình luận: {commentsError}
                </div>
              )}

              <div className="watchAddComment">
                <div className="watchCommentAvatar">Q</div>
                <input
                  className="watchCommentInput"
                  placeholder="Viết bình luận..."
                />
              </div>

              <div className="watchCommentsList">
                {displayComments.map((c) => (
                  <div key={c.id} className="watchCommentItem">
                    <img
                      className="watchCommentImg"
                      src={c.avatar}
                      alt={c.author}
                    />
                    <div className="watchCommentBody">
                      <div className="watchCommentMeta">
                        <span className="author">{c.author}</span>
                        <span className="time">{c.time}</span>
                      </div>
                      <div className="watchCommentText">{c.text}</div>
                      <div className="watchCommentActions">
                        <button className="watchCta">👍 {c.likes}</button>
                        <button className="watchCta">👎</button>
                        <button className="watchCta">
                          Phản hồi {c.replies > 0 && `(${c.replies})`}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {displayComments.length === 0 &&
                  !commentsLoading &&
                  !commentsError && (
                    <div
                      style={{
                        color: "#aaa",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      Chưa có bình luận nào
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        {/* Related Videos */}
        <div className="watchAside">
          {relatedLoading && (
            <div className="loading-text">Đang tải video liên quan...</div>
          )}
          {relatedError && (
            <div className="error-text">
              Lỗi tải video liên quan: {relatedError}
            </div>
          )}
          {!relatedLoading && !relatedError && relatedVideos.length === 0 && (
            <div className="loading-text" style={{ color: "#aaa" }}>
              Không tìm thấy video liên quan
            </div>
          )}
          {relatedVideos.map((video, i) => (
            <VideoListItem key={video.id?.videoId || i} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;
