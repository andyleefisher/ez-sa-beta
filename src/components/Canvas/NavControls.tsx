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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onAddCard('title')}
        >
          <Plus className="h-5 w-5" />
          Add Title
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onAddCard('idea')}
        >
          <Plus className="h-5 w-5" />
          Add Idea
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onAddCard('evidence')}
        >
          <Plus className="h-5 w-5" />
          Add Evidence
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => onAddCard('analysis')}
        >
          <Plus className="h-5 w-5" />
          Add Analysis
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onScreenshot}
          className="h-14 w-14 bg-white hover:bg-gray-100"
        >
          <Camera className="h-8 w-8 text-gray-900" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-14 w-14 bg-white hover:bg-gray-100"
        >
          <ZoomIn className="h-8 w-8 text-gray-900" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-14 w-14 bg-white hover:bg-gray-100"
        >
          <ZoomOut className="h-8 w-8 text-gray-900" />
        </Button>
      </div>
    </>
  );
}