import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideoCategories } from "../../redux/slices/categorySlice";
import "./Homepage.css";

const OptionsBar = ({ options }) => {
  const dispatch = useDispatch();
  const {
    items: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    // Fetch categories nếu chưa có
    if (categories.length === 0) {
      dispatch(fetchVideoCategories());
    }
  }, [dispatch, categories.length]);

  // Sử dụng categories từ API nếu có, fallback về options mock
  const displayOptions =
    categories.length > 0
      ? [{ id: "0", snippet: { title: "Tất cả" } }, ...categories]
      : options.map((option, index) => ({
          id: index.toString(),
          snippet: { title: option },
        }));

  if (categoriesLoading) {
    return (
      <div className="homePage-options">
        <div className="homePage-option">Đang tải...</div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="homePage-options">
        {options.map((option, index) => (
          <div key={index} className="homePage-option">
            {option}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="homePage-options">
      {displayOptions.map((option, index) => (
        <div key={option.id || index} className="homePage-option">
          {option.snippet?.title || option}
        </div>
      ))}
    </div>
  );
};

export default OptionsBar;
