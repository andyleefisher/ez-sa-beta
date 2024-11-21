import { cn } from '@/lib/utils';
import { Card as UICard } from '../ui/card';
import { Pen } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useRef, useEffect } from 'react';

interface TitleCardProps {
  id: string;
  content: string;
  onContentChange: (content: string) => void;
}

export const TitleCard = ({ 
  id, 
  content = '', 
  onContentChange 
}: TitleCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
          'bg-gray-50 border-gray-200',
          'hover:shadow-lg transition-shadow'
        )}
        data-title-card
      >
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-semibold capitalize">Title</div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pen className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        <div className="flex-grow h-auto" style={{ minHeight: '60px', maxHeight: 'none' }}>
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextareaChange}
              className={cn(
                "w-full p-2 bg-transparent border border-gray-300 rounded resize-none",
                "min-h-[60px]"
              )}
              style={{
                height: 'auto',
                maxHeight: 'none',
                overflow: 'visible'
              }}
              placeholder="Enter essay title here..."
              data-title-content
            />
          ) : (
            <div 
              className={cn(
                "w-full p-2 whitespace-pre-wrap break-words",
                "min-h-[60px]"
              )}
              style={{
                height: 'auto',
                maxHeight: 'none',
                overflow: 'visible'
              }}
              data-title-content
            >
              {content || "Enter essay title here..."}
            </div>
          )}
        </div>
      </UICard>
    </div>
  );
};