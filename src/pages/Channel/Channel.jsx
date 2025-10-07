import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import {
  setActiveTab,
  setPlaylistSort,
  setVideoSort,
} from "../../redux/slices/channelNavigationSlice";
import {
  fetchChannelSections,
  fetchChannelsInfo,
} from "../../redux/slices/channelSlice";
import "./Channel.css";
import ChannelBanner from "./components/ChannelBanner";
import ChannelInfo from "./components/ChannelInfo";
import ChannelNavigation from "./components/ChannelNavigation";
import HomeContent from "./components/HomeContent";
import PlaylistContent from "./components/PlaylistContent";
import PostContent from "./components/PostContent";
import ShortsContent from "./components/ShortsContent";
import VideoContent from "./components/VideoContent";
import { TABS } from "./mockData";

const Channel = () => {
  const { sideNavbar } = useOutletContext();
  const { id: channelId } = useParams();
  const dispatch = useDispatch();

  const { activeTab, videoSort, playlistSort } = useSelector(
    (state) => state.channelNavigation
  );

  useEffect(() => {
    if (channelId) {
      dispatch(fetchChannelSections(channelId));
      dispatch(fetchChannelsInfo([channelId]));
    }
  }, [dispatch, channelId]);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleVideoSortChange = (sort) => {
    dispatch(setVideoSort(sort));
  };

  const handlePlaylistSortChange = (sort) => {
    dispatch(setPlaylistSort(sort));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomeContent />;
      case "Video":
        return (
          <VideoContent
            videoSort={videoSort}
            onSortChange={handleVideoSortChange}
          />
        );
      case "Shorts":
        return <ShortsContent />;
      // case "Live video":
      //   return (
      //     <LiveVideoContent
      //       liveVideoSort={liveVideoSort}
      //       onSortChange={handleLiveVideoSortChange}
      //     />
      //   );
      case "Playlist":
        return (
          <PlaylistContent
            playlistSort={playlistSort}
            onSortChange={handlePlaylistSortChange}
          />
        );
      case "Post":
        return <PostContent />;
      default:
        return (
          <div
            style={{ color: "#aaa", textAlign: "center", padding: "40px 0" }}
          >
            {activeTab} content will be displayed here
          </div>
        );
    }
  };

  return (
    <div className={`${sideNavbar ? "channelPage" : "channelPage-full"}`}>
      <ChannelBanner />
      <ChannelInfo />
      <ChannelNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={TABS}
      />
      <div className="channel-content">{renderContent()}</div>
    </div>
  );
};

export default Channel;
