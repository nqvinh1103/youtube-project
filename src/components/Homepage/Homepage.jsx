import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import { options } from "../../mocks/options";
import { clearSearchResults } from "../../redux/slices/searchSlice";
import { fetchPopularVideos } from "../../redux/slices/videoSlice";
import { formatDuration, formatViewCount } from "../../utils/videoUtils";
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
  } = useSelector((state) => state.search);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchPopularVideos());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          nextPageToken &&
          searchResults.length === 0
        ) {
          dispatch(fetchPopularVideos(nextPageToken));
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [dispatch, loading, nextPageToken, searchResults.length]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

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
          <span
            onClick={() => dispatch(clearSearchResults())}
            style={{
              color: "#1976d2",
              cursor: "pointer",
              textDecoration: "underline",
              marginLeft: "5px",
            }}
          >
            Xem video phổ biến
          </span>
        </div>
      )}

      {isLoading && <h2>Đang tìm kiếm...</h2>}
      {hasError && <h2>Lỗi tìm kiếm: {hasError}</h2>}

      <div className="homeMainPage">
        {videosToShow.map((video, index) => (
          <Card key={video.id?.videoId || video.id || index} {...video} />
        ))}
      </div>

      {!searchResults.length && (
        <div ref={loadMoreRef} style={{ height: "20px", margin: "10px" }}>
          {loading && <h4>Đang tải thêm...</h4>}
          {!nextPageToken && !loading && (
            <h4 style={{ textAlign: "center" }}>Đã hết video để tải</h4>
          )}
        </div>
      )}

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
