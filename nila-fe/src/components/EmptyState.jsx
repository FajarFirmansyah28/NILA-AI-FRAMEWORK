import { FaFolderOpen } from "react-icons/fa";

const EmptyState = ({
  title = "No data found",
  subtitle = "We couldn't find any records matching your criteria.",
  icon = <FaFolderOpen />,
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">{icon}</div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-subtitle">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
