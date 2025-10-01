import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useSearchParams } from "react-router-dom";
import OptionsBar from "../../components/Homepage/OptionsBar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import VideoListItem from "../../components/Video/VideoListItem";
import { options } from "../../mocks/options";
import { searchVideos } from "../../redux/slices/searchSlice";
import { fetchPopularVideos } from "../../redux/slices/videoSlice";
import "./List.css";

const List = () => {
  const { sideNavbar } = useOutletContext();
  const [searchParams] = useSearchParams();
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

  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("category") || "0";
  const order = searchParams.get("order") || "relevance";

  useEffect(() => {
    if (q) {
      dispatch(
        searchVideos({
          query: q,
          categoryId: categoryId !== "0" ? categoryId : undefined,
          order: order,
          maxResults: 50,
        })
      );
    }
  }, [dispatch, q, categoryId, order]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !searchLoading) {
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
      <div className={`${sideNavbar ? "listPage" : "listPage-full"}`}>
        <LoadingSpinner size="large" text="Đang tải video..." />
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className={`${sideNavbar ? "listPage" : "listPage-full"}`}>
        <h2>Lỗi: {error}</h2>
      </div>
    );
  }

  return (
    <div className={`${sideNavbar ? "listPage" : "listPage-full"}`}>
      <OptionsBar options={options} />

      {searchLoading && (
        <div style={{ color: "#aaa", padding: "12px 0" }}>Đang tìm kiếm...</div>
      )}

      {searchError && (
        <div style={{ color: "red", padding: "12px 0" }}>
          Lỗi tìm kiếm: {searchError}
        </div>
      )}

      {searchResults.map((video, idx) => (
        <VideoListItem key={video.id?.videoId || idx} {...video} />
      ))}

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

      {searchResults.length === 0 && !searchLoading && !searchError && q && (
        <div style={{ color: "#aaa", padding: "12px 0" }}>
          Không tìm thấy kết quả cho "{q}"
        </div>
      )}

      {!q && (
        <div style={{ color: "#aaa", padding: "12px 0" }}>
          Nhập từ khóa để tìm kiếm
        </div>
      )}
    </div>
  );
};

export default List;
