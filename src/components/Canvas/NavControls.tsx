import { Button } from '@/components/ui/button';
import { Camera, ZoomIn, ZoomOut, Plus } from 'lucide-react';

interface NavControlsProps {
  onAddCard: (type: 'title' | 'idea' | 'evidence' | 'analysis') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onScreenshot: () => void;
}

export function NavControls({ onAddCard, onZoomIn, onZoomOut, onScreenshot }: NavControlsProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9 bg-white hover:bg-gray-50/80"
          onClick={() => onAddCard('title')}
        >
          <Plus className="h-4 w-4" />
          Add Title
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9 bg-white hover:bg-gray-50/80"
          onClick={() => onAddCard('idea')}
        >
          <Plus className="h-4 w-4" />
          Add Idea
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9 bg-white hover:bg-gray-50/80"
          onClick={() => onAddCard('evidence')}
        >
          <Plus className="h-4 w-4" />
          Add Evidence
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-9 bg-white hover:bg-gray-50/80"
          onClick={() => onAddCard('analysis')}
        >
          <Plus className="h-4 w-4" />
          Add Analysis
        </Button>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onScreenshot}
          className="h-9 w-9 bg-white hover:bg-gray-50/80"
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-9 w-9 bg-white hover:bg-gray-50/80"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-9 w-9 bg-white hover:bg-gray-50/80"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}