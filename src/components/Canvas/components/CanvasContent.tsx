import { useRef } from 'react';
import { Column } from '../Column';
import { Card } from '../Card';
import { columns, getColumnCards, isColumnComplete } from '../utils/columnUtils';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

interface CanvasContentProps {
  zoom: number;
  cards: any[];
  updateCard: (id: string, updates: any) => void;
  deleteCard: (id: string) => void;
  moveCard: (id: string, targetColumnId: string) => void;
}

export function CanvasContent({
  zoom,
  cards,
  updateCard,
  deleteCard,
  moveCard
}: CanvasContentProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleScreenshot = async () => {
    if (!canvasRef.current) return;

    try {
      const element = canvasRef.current;
      const originalTransform = element.style.transform;
      const originalHeight = element.style.height;
      
      element.style.transform = 'none';
      element.style.height = 'auto';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#f9fafb',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        foreignObjectRendering: true,
        removeContainer: false,
      });

      element.style.transform = originalTransform;
      element.style.height = originalHeight;

      const link = document.createElement('a');
      link.download = 'essay-plan.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      ref={canvasRef}
      data-canvas-container
      className="flex-1 mt-16 overflow-auto"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        height: '100%',
        minHeight: '1040px'
      }}
    >
      <div className="flex gap-4 h-full max-w-[1800px] mx-auto p-8">
        {columns.map(({ id, title }) => (
          <Column 
            key={id} 
            id={id} 
            title={title}
            isComplete={id !== 'landing-pad' && isColumnComplete(cards, id)}
            isStaging={id === 'landing-pad'}
          >
            {getColumnCards(cards, id).map(card => (
              <Card
                key={card.id}
                {...card}
                onContentChange={(content) => updateCard(card.id, { content })}
                onDelete={() => deleteCard(card.id)}
                onMove={(id, targetColumnId) => moveCard(id, targetColumnId)}
              />
            ))}
          </Column>
        ))}
      </div>
    </div>
  );
}