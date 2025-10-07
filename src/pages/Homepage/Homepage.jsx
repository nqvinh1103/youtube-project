import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import VideoCard from "../../components/VideoCard/VideoCard";
import { options } from "../../mocks/options";
import { fetchChannelsInfo } from "../../redux/slices/channelSlice";
import { fetchPopularVideos } from "../../redux/slices/videoSlice";
import "./Homepage.css";
import OptionsBar from "./OptionsBar";

const Homepage = () => {
  const { sideNavbar } = useOutletContext();
  const dispatch = useDispatch();
  const loadMoreRef = useRef(null);

  const { items, loading, error, nextPageToken } = useSelector(
    (state) => state.videos
  );
  const { channels: channelMap } = useSelector((state) => state.channels);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchPopularVideos());
    }
  }, [dispatch, items.length]);

  // Fetch channel info khi có videos mới
  useEffect(() => {
    if (items.length > 0) {
      const channelIds = items
        .map((video) => video.snippet?.channelId)
        .filter(Boolean);

      // Chỉ fetch channels chưa có trong cache
      const uncachedChannelIds = channelIds.filter(
        (channelId) => !channelMap[channelId]
      );

      if (uncachedChannelIds.length > 0) {
        dispatch(fetchChannelsInfo(uncachedChannelIds));
      }
    }
  }, [dispatch, items, channelMap]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextPageToken) {
          dispatch(fetchPopularVideos(nextPageToken));
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [dispatch, loading, nextPageToken]);

  if (loading && items.length === 0) {
    return (
      <div className={`${sideNavbar ? "homePage" : "homePage-full"}`}>
        <LoadingSpinner size="large" text="Đang tải video..." />
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className={`${sideNavbar ? "homePage" : "homePage-full"}`}>
        <h2>Lỗi: {error}</h2>
      </div>
    );
  }

  const videosToShow = items;
  const isLoading = loading;
  const hasError = error;

  return (
    <div className={`${sideNavbar ? "homePage" : "homePage-full"}`}>
      <OptionsBar options={options} />

      <div className="homeMainPage">
        {videosToShow.map((video, index) => (
          <VideoCard
            key={video.id?.videoId || video.id || index}
            {...video}
            channelMap={channelMap}
          />
        ))}
      </div>

      <div ref={loadMoreRef} style={{ margin: "20px 0" }}>
        {/* Loading indicator cho popular videos */}
        {loading && items.length > 0 && (
          <LoadingSpinner size="medium" text="Đang tải thêm video..." />
        )}

        {/* End message cho popular videos */}
        {!nextPageToken && !loading && items.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            🎉 Đã tải hết video có sẵn
          </div>
        )}
      </div>

      {videosToShow.length === 0 && !isLoading && !hasError && (
        <div className="no-results">
          <h3>Không có video nào</h3>
          <p>Hãy thử tải lại trang</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;
