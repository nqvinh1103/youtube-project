import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useSearchParams } from "react-router-dom";
import OptionsBar from "../../components/Homepage/OptionsBar";
import VideoListItem from "../../components/Video/VideoListItem";
import { options } from "../../mocks/options";
import { searchVideos } from "../../redux/slices/searchSlice";
import "./List.css";

const List = () => {
  const { sideNavbar } = useOutletContext();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
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
