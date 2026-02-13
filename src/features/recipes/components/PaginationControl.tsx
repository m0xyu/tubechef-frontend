import { Button } from '@/components/ui/button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationControlProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControl({ currentPage, lastPage, onPageChange }: PaginationControlProps) {
  if (lastPage <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示する数
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(lastPage - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < lastPage - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (lastPage !== 1) {
      range.push(lastPage);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* 前へボタン */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-10 w-10 border-gray-200"
      >
        <FaChevronLeft className="h-4 w-4" />
      </Button>

      {/* ページ番号ボタン */}
      <div className="flex gap-1">
        {pages.map((page, index) => (
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
              className={`h-10 w-10 ${
                currentPage === page 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500' 
                  : 'text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-orange-500'
              }`}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="flex items-center justify-center w-10 h-10 text-gray-400">
              ...
            </span>
          )
        ))}
      </div>

      {/* 次へボタン */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
        disabled={currentPage === lastPage}
        className="h-10 w-10 border-gray-200"
      >
        <FaChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}