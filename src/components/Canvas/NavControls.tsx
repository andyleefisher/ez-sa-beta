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
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 h-10 bg-white hover:bg-gray-50/80 shadow-sm"
          onClick={() => onAddCard('title')}
        >
          <Plus className="h-4 w-4" />
          Add Title
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 h-10 bg-white hover:bg-gray-50/80 shadow-sm"
          onClick={() => onAddCard('idea')}
        >
          <Plus className="h-4 w-4" />
          Add Idea
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 h-10 bg-white hover:bg-gray-50/80 shadow-sm"
          onClick={() => onAddCard('evidence')}
        >
          <Plus className="h-4 w-4" />
          Add Evidence
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 h-10 bg-white hover:bg-gray-50/80 shadow-sm"
          onClick={() => onAddCard('analysis')}
        >
          <Plus className="h-4 w-4" />
          Add Analysis
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onScreenshot}
          className="h-10 w-10 bg-white hover:bg-gray-50/80 shadow-sm"
        >
          <Camera className="h-5 w-5 text-gray-700" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-10 w-10 bg-white hover:bg-gray-50/80 shadow-sm"
        >
          <ZoomIn className="h-5 w-5 text-gray-700" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-10 w-10 bg-white hover:bg-gray-50/80 shadow-sm"
        >
          <ZoomOut className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
    </>
  );
}