import { cn } from '@/lib/utils';
import { Card as UICard } from '../ui/card';
import { Pen, Trash2, MoveHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useState, useRef, useEffect } from 'react';

interface CardProps {
  id: string;
  type: 'title' | 'idea' | 'evidence' | 'analysis';
  content: string;
  columnId: string;
  onContentChange: (content: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, targetColumnId: string) => void;
}

export const Card = ({ 
  id, 
  type, 
  content = '', 
  columnId,
  onContentChange,
  onDelete,
  onMove 
}: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const cardColors = {
    title: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200/70',
    idea: 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/70',
    evidence: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/70',
    analysis: 'bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-200/70',
  };

  const typeColors = {
    title: 'text-gray-600',
    idea: 'text-blue-600',
    evidence: 'text-emerald-600',
    analysis: 'text-violet-600',
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const columns = [
    { id: 'col-1', title: 'P1' },
    { id: 'col-2', title: 'P2' },
    { id: 'col-3', title: 'P3' },
    { id: 'col-4', title: 'P4' },
    { id: 'col-5', title: 'P5' },
  ];

  return (
    <div className="relative w-full">
      <UICard
        className={cn(
          'p-4 w-full',
          cardColors[type],
          'shadow-sm hover:shadow-md',
          'card-transition',
          'backdrop-blur-sm'
        )}
        data-card
      >
        <div className="flex justify-between items-start mb-3">
          <div className={cn(
            "text-xs font-semibold capitalize px-2 py-1",
            "rounded-full",
            "border border-current/20",
            "bg-white/50",
            typeColors[type]
          )}>
            {type}
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/50"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pen className="h-4 w-4 text-gray-600" />
            </Button>
            {type !== 'title' && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-white/50"
                    >
                      <MoveHorizontal className="h-4 w-4 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-32 bg-white shadow-lg border border-gray-200"
                  >
                    {columns.map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        disabled={column.id === columnId}
                        onClick={() => onMove(id, column.id)}
                        className="text-sm hover:bg-gray-50"
                      >
                        Move to {column.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-white/50"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex-grow">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              className={cn(
                "w-full p-3 bg-white/50 rounded-lg",
                "border border-gray-200/50",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30",
                "transition-shadow duration-200",
                "resize-none",
                "min-h-[100px]"
              )}
              placeholder={`Enter your ${type} here...`}
              data-card-content
            />
          ) : (
            <div 
              className={cn(
                "w-full p-3",
                "whitespace-pre-wrap break-words",
                "min-h-[100px]"
              )}
              data-card-content
            >
              {content || `Enter your ${type} here...`}
            </div>
          )}
        </div>
      </UICard>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 transition-colors"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};