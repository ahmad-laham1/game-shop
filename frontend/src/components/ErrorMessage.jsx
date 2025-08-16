export default function ErrorMessage({
  message,
  variant = "error",
  className = "",
}) {
  return (
    <div className={`message message-${variant} ${className}`}>{message}</div>
  );
}
