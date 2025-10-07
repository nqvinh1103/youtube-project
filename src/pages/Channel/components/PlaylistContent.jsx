import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPlaylistsByChannel } from "../../../redux/slices/channelSlice";

const PlaylistContent = ({ playlistSort, onSortChange }) => {
  const { id: channelId } = useParams();
  const dispatch = useDispatch();

  const playlistsData = useSelector(
    (state) => state.channels.playlistsById[channelId]
  );
  const playlists = playlistsData?.items || [];

  useEffect(() => {
    if (channelId && (!playlistsData || playlists.length === 0)) {
      dispatch(fetchPlaylistsByChannel({ channelId }));
    }
  }, [dispatch, channelId, playlistsData, playlists.length]);

  // Sort playlists based on selected sort option
  const sortedPlaylists = [...playlists].sort((a, b) => {
    switch (playlistSort) {
      case "Date added (newest)":
        return (
          new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
        );
      case "Date added (oldest)":
        return (
          new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt)
        );
      case "A-Z":
        return a.snippet.title.localeCompare(b.snippet.title);
      case "Z-A":
        return b.snippet.title.localeCompare(a.snippet.title);
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Playlist Header */}
      <div className="playlist-header">
        <h2 className="section-title">Created playlists</h2>
        <div className="playlist-sort">
          <span className="sort-label">Sort by</span>
          <select
            className="sort-dropdown"
            value={playlistSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="Date added (newest)">Date added (newest)</option>
            <option value="Date added (oldest)">Date added (oldest)</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="playlist-grid">
        {playlists.length > 0 ? (
          sortedPlaylists.map((playlist) => {
            const thumbnail =
              playlist.snippet?.thumbnails?.medium?.url ||
              playlist.snippet?.thumbnails?.default?.url;
            const title = playlist.snippet?.title || "Untitled Playlist";
            const videoCount = playlist.contentDetails?.itemCount || 0;
            const publishedAt = playlist.snippet?.publishedAt;

            return (
              <div key={playlist.id} className="playlist-card">
                <div className="playlist-thumbnail">
                  <img
                    src={thumbnail}
                    alt={title}
                    className="playlist-thumbnail-image"
                  />
                  <div className="playlist-video-count">
                    {videoCount} videos
                  </div>
                </div>
                <div className="playlist-info">
                  <h3 className="playlist-title">{title}</h3>
                  <p className="playlist-description">
                    {playlist.snippet?.description?.substring(0, 100)}...
                  </p>
                  <div className="playlist-meta">
                    Created {new Date(publishedAt).toLocaleDateString()}
                  </div>
                  <a
                    href={`/playlist/${playlist.id}`}
                    className="view-full-list"
                  >
                    View full list
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="loading-message">
            <p>Loading playlists...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaylistContent;
