import { forwardRef } from "react";

const Button = forwardRef(({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props
}, ref) => {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    danger: "btn-danger",
    success: "btn-success",
    ghost: "btn-ghost",
  };
  
  const sizeClasses = {
    small: "btn-small",
    medium: "btn-medium",
    large: "btn-large",
  };
  
  const stateClasses = [
    disabled && "btn-disabled",
    loading && "btn-loading",
  ].filter(Boolean);
  
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    ...stateClasses,
    className,
  ].filter(Boolean).join(" ");
  
  const isDisabled = disabled || loading;
  
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg className="spinner" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </span>
      )}
      <span className="btn-content">
        {children}
      </span>
    </button>
  );
});

Button.displayName = "Button";

export default Button;
