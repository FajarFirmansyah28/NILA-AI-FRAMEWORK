
const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  name,
  error = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="form-control"
        {...props}
      />
      {error && <span style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>{error}</span>}
    </div>
  );
};

export default Input;
