import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        {totalItems > 0 ? (
          <>
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
            <strong>{totalItems}</strong> entries
          </>
        ) : (
          "No entries to display"
        )}
      </div>
      <div className="pagination-buttons">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          <FaChevronLeft style={{ marginRight: "4px" }} /> Prev
        </button>
        
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
          // If totalPages is huge, we can show subset, but here dummy is small enough
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              className="pagination-btn"
              onClick={() => onPageChange(page)}
              style={{
                backgroundColor: isCurrent ? "var(--primary)" : "var(--bg-card)",
                color: isCurrent ? "white" : "var(--text-main)",
                borderColor: isCurrent ? "var(--primary)" : "var(--border)",
              }}
            >
              {page}
            </button>
          );
        })}

        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next <FaChevronRight style={{ marginLeft: "4px" }} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
