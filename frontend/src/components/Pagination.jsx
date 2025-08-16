import Button from "../components/Button";

export default function Pagination({
  currentPage,
  hasNext,
  hasPrevious,
  onPageChange,
  className = "",
}) {
  return (
    <div className={`pagination ${className}`}>
      <Button
        variant="secondary"
        size="small"
        disabled={!hasPrevious}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>
              <span className="pagination-current">Page {currentPage}</span>
      <Button
        variant="secondary"
        size="small"
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
