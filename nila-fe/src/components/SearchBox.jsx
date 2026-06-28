import { FaSearch } from "react-icons/fa";

const SearchBox = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="search-box-container">
      <FaSearch className="search-box-icon" />
      <input
        type="text"
        className="search-box-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBox;
