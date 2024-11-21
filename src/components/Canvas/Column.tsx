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
        'flex-1 min-h-fit rounded-lg',
        'bg-gray-100 border border-gray-200',
        'flex flex-col',
        'relative',
        isOver && 'bg-gray-200/50 border-gray-300',
        isStaging && 'bg-gray-50'
      )}
      style={{
        height: '100%',
        minHeight: '1040px' // Increased from 800px to 1040px (30% more)
      }}
      data-column
    >
      <div className={cn(
        "py-3 px-4 border-b border-gray-200",
        "text-lg font-semibold text-center",
        "sticky top-0 bg-inherit z-10",
        isComplete ? "text-red-600" : "text-gray-700"
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