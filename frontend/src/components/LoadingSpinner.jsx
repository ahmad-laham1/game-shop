export default function LoadingSpinner({ size = "medium", className = "" }) {
  return (
    <div className={`loading-spinner loading-spinner-${size} ${className}`}>
      <div className="spinner"></div>
      <span>Loading…</span>
    </div>
  );
}
