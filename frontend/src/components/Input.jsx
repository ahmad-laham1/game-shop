import { useState, useEffect } from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  minLength,
  maxLength,
  pattern,
  error,
  touched,
  className = "",
  disabled = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setHasValue(!!newValue);
    
    // Clear local error when user starts typing
    if (localError) {
      setLocalError("");
    }
    
    onChange(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    
    // Validate on blur
    const validationError = validateField(e.target.value);
    if (validationError) {
      setLocalError(validationError);
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  const validateField = (value) => {
    if (required && !value.trim()) {
      return `${label} is required`;
    }
    
    if (minLength && value.length < minLength) {
      return `${label} must be at least ${minLength} characters`;
    }
    
    if (maxLength && value.length > maxLength) {
      return `${label} must be no more than ${maxLength} characters`;
    }
    
    if (pattern && value && !new RegExp(pattern).test(value)) {
      if (type === "email") {
        return "Please enter a valid email address";
      }
      return `Please enter a valid ${label.toLowerCase()}`;
    }
    
    return "";
  };

  const showError = (error || localError) && (touched || hasValue);
  const inputClassName = `
    input-field
    ${hasValue ? "has-value" : ""}
    ${isFocused ? "focused" : ""}
    ${showError ? "error" : ""}
    ${disabled ? "disabled" : ""}
    ${className}
  `.trim();

  return (
    <div className="input-wrapper">
      <label className="input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        disabled={disabled}
        className={inputClassName}
        {...props}
      />
      
      {showError && (
        <div className="input-error">
          {error || localError}
        </div>
      )}
      
      {maxLength && (
        <div className="input-counter">
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );
}
