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
    title: 'bg-gray-50 border-gray-200',
    idea: 'bg-blue-50 border-blue-200',
    evidence: 'bg-green-50 border-green-200',
    analysis: 'bg-purple-50 border-purple-200',
  };

  const columns = [
    { id: 'col-1', title: 'P1' },
    { id: 'col-2', title: 'P2' },
    { id: 'col-3', title: 'P3' },
    { id: 'col-4', title: 'P4' },
    { id: 'col-5', title: 'P5' },
  ];

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <div className="relative w-full">
      <UICard
        className={cn(
          'p-4 w-full',
          cardColors[type],
          'hover:shadow-lg transition-shadow'
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-semibold capitalize">{type}</div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pen className="h-4 w-4 text-gray-600" />
            </Button>
            {type !== 'title' && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
                    >
                      <MoveHorizontal className="h-4 w-4 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {columns.map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        disabled={column.id === columnId}
                        onClick={() => onMove(id, column.id)}
                      >
                        Move to {column.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
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
                "w-full p-2 bg-transparent border border-gray-300 rounded resize-none",
                "min-h-[100px]"
              )}
              placeholder={`Enter your ${type} here...`}
              data-card-content
            />
          ) : (
            <div 
              className={cn(
                "w-full p-2 whitespace-pre-wrap break-words",
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};