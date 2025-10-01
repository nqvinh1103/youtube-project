import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { options } from "../../mocks/options";
import { searchVideos } from "../../redux/slices/searchSlice";
import { fetchPopularVideos } from "../../redux/slices/videoSlice";
import { formatDuration, formatViewCount } from "../../utils/videoUtils";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./Homepage.css";
import OptionsBar from "./OptionsBar";

const Card = ({ id, snippet, statistics, contentDetails }) => {
  const videoId = id?.videoId || id;
  const videoDuration = contentDetails?.duration
    ? formatDuration(contentDetails.duration)
    : "10:00";

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
            src={snippet?.thumbnails?.default?.url}
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

const Homepage = () => {
  const { sideNavbar } = useOutletContext();
  const dispatch = useDispatch();
  const loadMoreRef = useRef(null);

  const { items, loading, error, nextPageToken } = useSelector(
    (state) => state.videos
  );
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    nextPageToken: searchNextPageToken,
    query: searchQuery,
  } = useSelector((state) => state.search);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchPopularVideos());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !searchLoading) {
          if (searchResults.length === 0 && nextPageToken) {
            dispatch(fetchPopularVideos(nextPageToken));
          } else if (
            searchResults.length > 0 &&
            searchNextPageToken &&
            searchQuery
          ) {
            dispatch(
              searchVideos({
                query: searchQuery,
                pageToken: searchNextPageToken,
                isLoadMore: true,
              })
            );
          }
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
  }, [
    dispatch,
    loading,
    nextPageToken,
    searchResults.length,
    searchLoading,
    searchNextPageToken,
    searchQuery,
  ]);

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

  const videosToShow = searchResults.length > 0 ? searchResults : items;
  const isLoading = searchLoading;
  const hasError = searchError;

  return (
    <div className={`${sideNavbar ? "homePage" : "homePage-full"}`}>
      <OptionsBar options={options} />

      {/* Search indicator */}
      {searchResults.length > 0 && (
        <div
          style={{
            padding: "10px 20px",
            backgroundColor: "#f0f0f0",
            color: "#333",
            fontSize: "14px",
            borderBottom: "1px solid #ddd",
          }}
        >
          🔍 Đang hiển thị kết quả tìm kiếm -
        </div>
      )}

      {isLoading && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <LoadingSpinner size="medium" text="Đang tìm kiếm video..." />
        </div>
      )}
      {hasError && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#d32f2f",
            backgroundColor: "#ffebee",
            margin: "10px",
            borderRadius: "4px",
          }}
        >
          <h3>Lỗi tìm kiếm: {hasError}</h3>
        </div>
      )}

      <div className="homeMainPage">
        {videosToShow.map((video, index) => (
          <Card key={video.id?.videoId || video.id || index} {...video} />
        ))}
      </div>

      <div ref={loadMoreRef} style={{ margin: "20px 0" }}>
        {/* Loading indicator cho popular videos */}
        {loading && items.length > 0 && searchResults.length === 0 && (
          <LoadingSpinner size="medium" text="Đang tải thêm video..." />
        )}

        {/* Loading indicator cho search results */}
        {searchLoading && searchResults.length > 0 && (
          <LoadingSpinner
            size="medium"
            text="Đang tải thêm kết quả tìm kiếm..."
          />
        )}

        {/* End message cho popular videos */}
        {!nextPageToken &&
          !loading &&
          items.length > 0 &&
          searchResults.length === 0 && (
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

        {/* End message cho search results */}
        {!searchNextPageToken && !searchLoading && searchResults.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            🔍 Đã tải hết kết quả tìm kiếm
          </div>
        )}
      </div>

      {videosToShow.length === 0 && !isLoading && !hasError && (
        <div className="no-results">
          <h3>Không tìm thấy video nào</h3>
          <p>Hãy thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;
