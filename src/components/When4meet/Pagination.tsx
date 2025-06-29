import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    setCurrentPage,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="mb-4 flex justify-center gap-2">
            <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ←
            </button>
            <span className="px-3 py-1 text-gray-300">
                Page {currentPage + 1} of {totalPages}
            </span>
            <button
                onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                →
            </button>
        </div>
    );
}; 