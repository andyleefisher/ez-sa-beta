import { useState, useRef, useCallback } from 'react';
import { TopNav } from './TopNav';
import { NavControls } from './NavControls';
import { Column } from './Column';
import { Card } from './Card';
import html2canvas from 'html2canvas';
import { nanoid } from 'nanoid';

const columns = [
  { id: 'landing-pad', title: 'Landing Pad' },
  { id: 'col-1', title: 'P1' },
  { id: 'col-2', title: 'P2' },
  { id: 'col-3', title: 'P3' },
  { id: 'col-4', title: 'P4' },
  { id: 'col-5', title: 'P5' }
];

interface CardType {
  id: string;
  type: 'title' | 'idea' | 'evidence' | 'analysis';
  content: string;
  columnId: string;
}

export function InfiniteCanvas() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddCard = useCallback((type: 'title' | 'idea' | 'evidence' | 'analysis') => {
    const newCard: CardType = {
      id: nanoid(),
      type,
      content: '',
      columnId: 'landing-pad'
    };
    setCards(prev => [...prev, newCard]);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const prepareForScreenshot = (element: HTMLElement) => {
    const contentElements = element.querySelectorAll('[data-card-content], [data-title-content]');
    contentElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const originalStyles = {
          height: el.style.height,
          maxHeight: el.style.maxHeight,
          overflow: el.style.overflow,
          display: el.style.display
        };

        el.style.height = 'auto';
        el.style.maxHeight = 'none';
        el.style.overflow = 'visible';
        el.style.display = 'block';

        el.offsetHeight;

        return () => {
          el.style.height = originalStyles.height;
          el.style.maxHeight = originalStyles.maxHeight;
          el.style.overflow = originalStyles.overflow;
          el.style.display = originalStyles.display;
        };
      }
    });
  };

  const handleScreenshot = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const element = canvasRef.current;
      const originalTransform = element.style.transform;
      const originalHeight = element.style.height;
      
      element.style.transform = 'none';
      element.style.height = 'auto';

      const cleanup = prepareForScreenshot(element);

      element.offsetHeight;
      await new Promise(resolve => setTimeout(resolve, 500));

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
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-canvas-container]');
          if (clonedElement instanceof HTMLElement) {
            prepareForScreenshot(clonedElement);
            
            const titleContent = clonedElement.querySelector('[data-title-content]');
            if (titleContent instanceof HTMLElement) {
              titleContent.style.cssText = `
                position: static !important;
                height: auto !important;
                min-height: 60px !important;
                max-height: none !important;
                overflow: visible !important;
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
                white-space: pre-wrap !important;
                word-break: break-word !important;
              `;
              
              titleContent.offsetHeight;
            }
          }
        }
      });

      cleanup?.();
      element.style.transform = originalTransform;
      element.style.height = originalHeight;

      const link = document.createElement('a');
      link.download = 'essay-plan.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  }, []);

  const handleCardContentChange = useCallback((id: string, content: string) => {
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, content } : card
    ));
  }, []);

  const handleCardDelete = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  }, []);

  const handleCardMove = useCallback((id: string, targetColumnId: string) => {
    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, columnId: targetColumnId } : card
    ));
  }, []);

  const getColumnCards = (columnId: string) => {
    return cards
      .filter(card => card.columnId === columnId)
      .sort((a, b) => {
        const order = { title: 0, idea: 1, evidence: 2, analysis: 3 };
        return order[a.type] - order[b.type];
      });
  };

  const isColumnComplete = (columnId: string) => {
    const columnCards = getColumnCards(columnId);
    const hasIdea = columnCards.some(card => card.type === 'idea');
    const hasEvidence = columnCards.some(card => card.type === 'evidence');
    const hasAnalysis = columnCards.some(card => card.type === 'analysis');
    return hasIdea && hasEvidence && hasAnalysis;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
      <TopNav>
        <NavControls
          onAddCard={handleAddCard}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onScreenshot={handleScreenshot}
        />
      </TopNav>

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
              isComplete={id !== 'landing-pad' && isColumnComplete(id)}
              isStaging={id === 'landing-pad'}
            >
              {getColumnCards(id).map(card => (
                <Card
                  key={card.id}
                  {...card}
                  onContentChange={(content) => handleCardContentChange(card.id, content)}
                  onDelete={() => handleCardDelete(card.id)}
                  onMove={(id, targetColumnId) => handleCardMove(id, targetColumnId)}
                />
              ))}
            </Column>
          ))}
        </div>
      </div>
    </div>
  );
}