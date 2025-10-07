import SearchIcon from "@mui/icons-material/Search";
import React from "react";

const ChannelNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="channel-nav">
      <div className="nav-tabs">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`nav-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </div>
        ))}
        <div className="nav-search">
          <SearchIcon className="search-icon" />
        </div>
      </div>
    </div>
  );
};

export default ChannelNavigation;
