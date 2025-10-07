import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChannelBanner = () => {
  const { id: channelId } = useParams();
  const channelInfo = useSelector(
    (state) => state.channels.channels?.[channelId]
  );
  const bannerUrl = channelInfo?.bannerUrl;

  return (
    <div className="channel-banner">
      <div className="channel-banner-content">
        {bannerUrl ? (
          <img
            src={`${bannerUrl}=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj`}
            alt=""
          />
        ) : (
          <div style={{ height: 180, background: "#222" }} />
        )}
      </div>
    </div>
  );
};

export default ChannelBanner;
