import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface ColumnProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  isComplete?: boolean;
  isStaging?: boolean;
}

export const Column = ({ 
  id, 
  title, 
  children, 
  isComplete, 
  isStaging
}: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 min-h-fit rounded-xl',
        'bg-white/80 backdrop-blur-sm',
        'border border-gray-200/50',
        'flex flex-col',
        'relative',
        'shadow-lg shadow-blue-900/5',
        'transition-all duration-200',
        isOver && 'bg-blue-50/50 border-blue-200/50 scale-[1.02]',
        isStaging && 'bg-white/90'
      )}
      style={{
        height: '100%',
        minHeight: '1040px'
      }}
      data-column
    >
      <div className={cn(
        "py-4 px-4",
        "column-header",
        "rounded-t-xl",
        "title-font text-lg font-semibold text-center",
        "sticky top-0 z-10",
        isComplete ? "text-blue-600" : "text-gray-700"
      )}>
        {title}
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-4 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};