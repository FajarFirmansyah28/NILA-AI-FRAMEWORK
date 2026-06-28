
const Loading = ({ message = "Loading data..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default Loading;
