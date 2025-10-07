import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import VideoCard from "../../../components/VideoCard/VideoCard";
import { fetchPopularVideos } from "../../../redux/slices/channelSlice";

const VideoContent = ({ videoSort, onSortChange }) => {
  const { id: channelId } = useParams();
  const dispatch = useDispatch();

  const popularData = useSelector(
    (state) => state.channels.popularVideosByChannelId[channelId]
  );
  const popularVideos = popularData?.items || [];
  console.log("Popular Videos:", popularVideos);
  console.log("Total videos fetched:", popularVideos.length);

  useEffect(() => {
    if (channelId && (!popularVideos || popularVideos.length === 0)) {
      dispatch(fetchPopularVideos({ channelId, maxResults: 50 }));
    }
  }, [dispatch, channelId]);
  return (
    <>
      {/* Video Sorting Buttons */}
      {/* <div className="video-sorting">
        <button
          className={`sort-button ${videoSort === "latest" ? "active" : ""}`}
          onClick={() => onSortChange("latest")}
        >
          Latest
        </button>
        <button
          className={`sort-button ${videoSort === "popular" ? "active" : ""}`}
          onClick={() => onSortChange("popular")}
        >
          Popular
        </button>
        <button
          className={`sort-button ${videoSort === "oldest" ? "active" : ""}`}
          onClick={() => onSortChange("oldest")}
        >
          Oldest
        </button>
      </div> */}

      {/* Video Grid */}
      <div className="video-grid">
        {popularVideos.length > 0 ? (
          popularVideos.map((video, index) => {
            console.log(`Rendering video ${index + 1}:`, video.snippet?.title);
            return <VideoCard key={video.id?.videoId || index} {...video} />;
          })
        ) : (
          <p>Đang tải videos...</p>
        )}
      </div>
    </>
  );
};

export default VideoContent;
