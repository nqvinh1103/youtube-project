import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPopularVideos } from "../../../redux/slices/channelSlice";

const HomeContent = () => {
  const { id: channelId } = useParams();
  const dispatch = useDispatch();
  const carouselRef = useRef(null);
  const popularCarouselRef = useRef(null);
  const shortsCarouselRef = useRef(null);

  // Selectors for different data
  const popularData = useSelector(
    (state) => state.channels.popularVideosByChannelId[channelId]
  );

  const popularVideos = useMemo(() => popularData?.items || [], [popularData]);

  // Fetch data on mount
  useEffect(() => {
    if (channelId) {
      // Always fetch popular videos
      dispatch(fetchPopularVideos({ channelId, maxResults: 20 }));
    }
  }, [dispatch, channelId]);

  // Get shorts by filtering popular videos (duration <= 60 seconds)
  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    const minutes = parseInt(match?.[1] || 0);
    const seconds = parseInt(match?.[2] || 0);
    return minutes * 60 + seconds;
  };

  const shortsVideos = useMemo(() => {
    return popularVideos.filter((video) => {
      const duration = parseDuration(video.contentDetails?.duration || "PT0S");
      return duration <= 60; // chỉ lấy video <= 60 giây
    });
  }, [popularVideos]);

  // Debug logging
  console.log("Popular videos:", popularVideos);
  console.log("Shorts videos:", shortsVideos);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      const currentScroll = ref.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      ref.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  const formatViewCount = (count) => {
    if (!count) return "0";
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} Tr`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)} N`;
    return num.toString();
  };

  const formatTimeAgo = (publishedAt) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  };

  return (
    <>
      {/* Dành cho bạn (For you) Section */}
      <div className="for-you-section">
        <h2 className="section-title">Dành cho bạn</h2>
        <div className="video-carousel">
          <div className="carousel-container">
            <button
              className="carousel-arrow left"
              onClick={() => scrollCarousel(carouselRef, "left")}
            >
              <span>‹</span>
            </button>
            <div className="carousel-content" ref={carouselRef}>
              {popularVideos.length > 0 ? (
                popularVideos.slice(0, 8).map((video) => {
                  const { videoId } = video.id;
                  const { title, thumbnails, publishedAt } = video.snippet;
                  const viewCount = video.statistics?.viewCount;

                  return (
                    <div key={videoId} className="carousel-video">
                      <div className="video-thumbnail">
                        <img
                          src={
                            thumbnails?.medium?.url || thumbnails?.default?.url
                          }
                          alt={title}
                          className="thumbnail-image"
                        />
                        <div className="video-duration">
                          {video.contentDetails?.duration
                            ? video.contentDetails.duration
                                .replace("PT", "")
                                .replace("H", ":")
                                .replace("M", ":")
                                .replace("S", "")
                            : "0:00"}
                        </div>
                      </div>
                      <div className="video-info">
                        <h4 className="video-title">{title}</h4>
                        <div className="video-meta">
                          {formatViewCount(viewCount)} lượt xem •{" "}
                          {formatTimeAgo(publishedAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Đang tải video...</p>
              )}
            </div>
            <button
              className="carousel-arrow right"
              onClick={() => scrollCarousel(carouselRef, "right")}
            >
              <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video phổ biến (Popular videos) Section */}
      <div className="popular-videos-section">
        <h2 className="section-title">Video phổ biến</h2>
        <div className="video-carousel">
          <div className="carousel-container">
            <button
              className="carousel-arrow left"
              onClick={() => scrollCarousel(popularCarouselRef, "left")}
            >
              <span>‹</span>
            </button>
            <div className="carousel-content" ref={popularCarouselRef}>
              {popularVideos.length > 0 ? (
                [...popularVideos]
                  .sort((a, b) => {
                    // Sort by view count (highest first)
                    const aViews = parseInt(a.statistics?.viewCount || 0);
                    const bViews = parseInt(b.statistics?.viewCount || 0);
                    return bViews - aViews;
                  })
                  .slice(0, 10)
                  .map((video) => {
                    const { videoId } = video.id;
                    const { title, thumbnails, publishedAt } = video.snippet;
                    const viewCount = video.statistics?.viewCount;

                    return (
                      <div key={videoId} className="carousel-video">
                        <div className="video-thumbnail">
                          <img
                            src={
                              thumbnails?.medium?.url ||
                              thumbnails?.default?.url
                            }
                            alt={title}
                            className="thumbnail-image"
                          />
                          <div className="video-duration">
                            {video.contentDetails?.duration
                              ? video.contentDetails.duration
                                  .replace("PT", "")
                                  .replace("H", ":")
                                  .replace("M", ":")
                                  .replace("S", "")
                              : "0:00"}
                          </div>
                        </div>
                        <div className="video-info">
                          <h4 className="video-title">{title}</h4>
                          <div className="video-meta">
                            {formatViewCount(viewCount)} lượt xem •{" "}
                            {formatTimeAgo(publishedAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p>Đang tải video phổ biến...</p>
              )}
            </div>
            <button
              className="carousel-arrow right"
              onClick={() => scrollCarousel(popularCarouselRef, "right")}
            >
              <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shorts Section */}
      <div className="shorts-section">
        <div className="shorts-header">
          <h2 className="section-title">Shorts</h2>
          <div className="shorts-menu">⋮</div>
        </div>
        <div className="video-carousel">
          <div className="carousel-container">
            <button
              className="carousel-arrow left"
              onClick={() => scrollCarousel(shortsCarouselRef, "left")}
            >
              <span>‹</span>
            </button>
            <div
              className="carousel-content shorts-content"
              ref={shortsCarouselRef}
            >
              {shortsVideos.length > 0 ? (
                shortsVideos.slice(0, 8).map((video) => {
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
              onClick={() => scrollCarousel(shortsCarouselRef, "right")}
            >
              <span>›</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeContent;
