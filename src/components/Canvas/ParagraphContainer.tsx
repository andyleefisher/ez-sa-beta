import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface ParagraphContainerProps {
  id: string;
  children?: React.ReactNode;
}

export const ParagraphContainer = ({ id, children }: ParagraphContainerProps) => {
  const { setNodeRef: setDroppableRef } = useDroppable({ id });
  const { attributes, listeners, setNodeRef: setDraggableRef, transform } = useDraggable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={(node) => {
        setDroppableRef(node);
        setDraggableRef(node);
      }}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'min-w-[300px] min-h-[200px] p-4 rounded-lg',
        'bg-white/50 border-2 border-dashed border-gray-200',
        'hover:border-gray-300 transition-colors'
      )}
    >
      <div className="text-sm font-medium mb-2">Paragraph Container</div>
      {children}
    </div>
  );
};