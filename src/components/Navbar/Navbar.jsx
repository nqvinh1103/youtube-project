import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import MicIcon from "@mui/icons-material/Mic";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  clearSearchResults,
  searchVideos,
} from "../../redux/slices/searchSlice";

import "./Navbar.css";
const Navbar = (props) => {
  const { setSideNavbarHandler, sideNavbar } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [searchTerm] = useSearchParams();
  const searchParam = searchTerm.get("q") || "";

  useEffect(() => {
    setQuery(searchParam);
  }, [searchParam]);

  const sideNavbarFunc = () => {
    setSideNavbarHandler(!sideNavbar);
  };

  const onSearch = useCallback(() => {
    const q = query.trim();
    if (!q) return;

    dispatch(searchVideos({ query: q }));

    navigate(`/list?q=${encodeURIComponent(q)}`);
  }, [navigate, query, dispatch]);

  const onClearSearch = useCallback(() => {
    dispatch(clearSearchResults());
    setQuery("");

    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div className="navbar">
      <div className="nav-start">
        <div className="navIcon" onClick={sideNavbarFunc}>
          <MenuIcon style={{ color: "white" }} />
        </div>
        <div
          className="youtubeIcon"
          onClick={onClearSearch}
          style={{ cursor: "pointer" }}
        >
          <YouTubeIcon style={{ fontSize: "34px" }} className="logo" />
          <div className="nav_utubeTitle">Youtube</div>
        </div>
      </div>
      <div className="nav-center">
        <div className="navSearchBox">
          <input
            className="navSearchInput"
            type="text"
            placeholder="Tìm kiếm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          <div className="navSearchIcon" onClick={onSearch}>
            <SearchIcon style={{ fontSize: "28px", color: "white" }} />
          </div>
        </div>
        <div className="navMicIcon">
          <MicIcon style={{ color: "white" }} />
        </div>
      </div>
      <div className="nav-end">
        <div className="navAddIcon">
          <AddIcon
            style={{ fontSize: "30px", cursor: "pointer", color: "white" }}
          />
          <div style={{ fontSize: "15px", marginLeft: "5px" }}>Tạo</div>
        </div>
        <NotificationsNoneIcon
          style={{ fontSize: "30px", cursor: "pointer", color: "white" }}
        />
        <div className="navAvatarIcon">Q</div>
      </div>
    </div>
  );
};

export default Navbar;
