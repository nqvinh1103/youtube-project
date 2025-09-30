import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import HistorySharpIcon from "@mui/icons-material/HistorySharp";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import QueryBuilderOutlinedIcon from "@mui/icons-material/QueryBuilderOutlined";
import SmartDisplayOutlinedIcon from "@mui/icons-material/SmartDisplayOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

import "./Sidebar.css";
const Sidebar = ({ sideNavbar }) => {
  return (
    <div
      className={
        sideNavbar ? "home-sidebar home-sidebarOpen" : "home-sidebarHide"
      }
    >
      {/* top section */}
      <div className="home-sidebarTop">
        <div className={`home-sidebarTopOption`}>
          <HomeOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Trang chủ</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <OndemandVideoOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Shorts</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <SubscriptionsOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Kênh đăng ký</div>
        </div>
      </div>
      {/* middle section */}
      <div className="home-sidebarMiddle">
        <div
          style={{ gap: "10px", marginTop: "12px", fontWeight: "bold" }}
          className={`home-sidebarTopOption`}
        >
          Bạn
          <ArrowForwardIosSharpIcon
            style={{ fontSize: "15px", marginLeft: "0px" }}
          />
        </div>
        <div className={`home-sidebarTopOption`}>
          <HistorySharpIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Video đã xem</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <PlaylistPlayOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Danh sách phát</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <SmartDisplayOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Video của bạn</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <QueryBuilderOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Xem sau</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <ThumbUpOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Video đã thích</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <FileDownloadOutlinedIcon style={{ fontSize: "25px" }} />
          <div className="home-sidebarTopOptionTitle">Nội dung tải xuống</div>
        </div>
      </div>
      {/* bottom section */}
      <div className="home-sidebarMiddle">
        <div
          style={{ gap: "10px", marginTop: "12px", fontWeight: "bold" }}
          className={`home-sidebarTopOption`}
        >
          Kênh đăng ký
          <ArrowForwardIosSharpIcon
            style={{ fontSize: "15px", marginLeft: "0px" }}
          />
        </div>
        <div className={`home-sidebarTopOption`}>
          <img
            className="home-sidebarImgLogo"
            src="https://yt3.ggpht.com/7HR7AS1zqCg3HDKKhU734Hoqaz277rXAkSkjJlui8cf_jrw31GZF2aPn3i9JS6Hhwgcxutp0jg=s176-c-k-c0x00ffffff-no-rj-mo"
            alt=""
          />
          <div className="home-sidebarTopOptionTitle">UR · Cristiano</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <img
            className="home-sidebarImgLogo"
            src="https://yt3.googleusercontent.com/xhro86GPyaXdFr5WvEcf4CFKfTf5ZDJXEGoh6D_LcwfjbacuOYpRIhRDtwTcsuiHS3nYaZef=s160-c-k-c0x00ffffff-no-rj"
            alt=""
          />
          <div className="home-sidebarTopOptionTitle">YBY1</div>
        </div>
        <div className={`home-sidebarTopOption`}>
          <img
            className="home-sidebarImgLogo"
            src="https://yt3.googleusercontent.com/0NZixqCnY1-iO7GQqNQu7Y2-pQrMLZVe-r8iMxtEf3qdDb_QKr9OuYiaB_MO0aKvOom2HpITKg=s160-c-k-c0x00ffffff-no-rj"
            alt=""
          />
          <div className="home-sidebarTopOptionTitle">DANGBEOO</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
