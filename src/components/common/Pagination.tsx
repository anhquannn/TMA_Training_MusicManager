import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

/**
 * Reusable pagination component used across list pages. It renders "First/Prev/number/Next/Last" controls
 * and, if totalItems is provided, also a small description text such as
 * "Hiển thị 11 đến 20 trong tổng số 43 bản ghi".
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  // Limit number buttons to reasonable count
  const visibleButtons = 5;
  let start = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
  let end = start + visibleButtons - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visibleButtons + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between mt-4 ${className}`}>
      {totalItems !== undefined && (
        <div className="text-sm text-gray-600 mb-2 md:mb-0">
          Hiển thị{' '}
          <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> đến{' '}
          <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> trong tổng số{' '}
          <span className="font-medium">{totalItems}</span> bản ghi
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Đầu
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Trước
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded-md ${page === currentPage ? 'bg-blue-500 text-white' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Tiếp
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-50"
        >
          Cuối
        </button>
      </div>
    </div>
  );
};

export default Pagination;
