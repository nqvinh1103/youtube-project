import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPopularVideos } from "../../../redux/slices/channelSlice";

const ShortsContent = () => {
  const { id: channelId } = useParams();
  const dispatch = useDispatch();
  const shortsCarouselRef = useRef(null);

  const popularData = useSelector(
    (state) => state.channels.popularVideosByChannelId[channelId]
  );
  const popularVideos = popularData?.items || [];

  useEffect(() => {
    if (channelId && (!popularVideos || popularVideos.length === 0)) {
      dispatch(fetchPopularVideos({ channelId, maxResults: 50 }));
    }
  }, [dispatch, channelId, popularVideos]);

  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    const minutes = parseInt(match?.[1] || 0);
    const seconds = parseInt(match?.[2] || 0);
    return minutes * 60 + seconds;
  };

  const shortVideos = popularVideos.filter((video) => {
    const duration = parseDuration(video.contentDetails?.duration || "PT0S");
    return duration <= 60; // chỉ lấy video <= 60 giây
  });

  const formatViewCount = (count) => {
    if (!count) return "0";
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} Tr`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)} N`;
    return num.toString();
  };

  const scrollCarousel = (direction) => {
    if (shortsCarouselRef.current) {
      const scrollAmount = 300;
      const currentScroll = shortsCarouselRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      shortsCarouselRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="shorts-content-page">
      <div className="shorts-header">
        <h2 className="section-title">Shorts</h2>
        <div className="shorts-menu">⋮</div>
      </div>

      <div className="video-carousel">
        <div className="carousel-container">
          <button
            className="carousel-arrow left"
            onClick={() => scrollCarousel("left")}
          >
            <span>‹</span>
          </button>
          <div
            className="carousel-content shorts-content"
            ref={shortsCarouselRef}
          >
            {shortVideos.length > 0 ? (
              shortVideos.map((video) => {
                const { videoId } = video.id;
                const { title, thumbnails } = video.snippet;
                const viewCount = video.statistics?.viewCount;

                return (
                  <div key={videoId} className="shorts-video-card">
                    <div className="shorts-thumbnail">
                      <img
                        src={
                          thumbnails?.medium?.url || thumbnails?.default?.url
                        }
                        alt={title}
                        className="shorts-thumbnail-image"
                      />
                    </div>
                    <div className="shorts-video-info">
                      <h4 className="shorts-video-title">{title}</h4>
                      <div className="shorts-video-meta">
                        <span className="shorts-menu-dots">⋮</span>
                        <span className="shorts-view-count">
                          {formatViewCount(viewCount)} lượt xem
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Đang tải Shorts...</p>
            )}
          </div>
          <button
            className="carousel-arrow right"
            onClick={() => scrollCarousel("right")}
          >
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortsContent;
