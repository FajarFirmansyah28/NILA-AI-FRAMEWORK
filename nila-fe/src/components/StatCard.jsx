
const StatCard = ({
  label,
  value,
  icon,
  indicator = null,
  indicatorType = "neutral",
  iconBgColor = "var(--primary-light)",
  iconColor = "var(--primary)",
  className = "",
}) => {
  return (
    <div className={`stat-card-wrapper ${className}`}>
      <div className="stat-card-info">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
        {indicator && (
          <span className={`stat-card-indicator ${indicatorType}`}>
            {indicator}
          </span>
        )}
      </div>
      <div
        className="stat-card-icon-box"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
