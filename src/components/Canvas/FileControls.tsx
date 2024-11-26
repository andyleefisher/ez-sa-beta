import { Button } from '@/components/ui/button';
import { FolderOpen, Save, FileX } from 'lucide-react';

interface FileControlsProps {
  onOpen: () => void;
  onSave: () => void;
  onNew: () => void;
}

export function FileControls({ onOpen, onSave, onNew }: FileControlsProps) {
  return (
    <div className="flex items-center gap-2 border-r border-gray-200 pr-4 mr-4">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-9 bg-white hover:bg-gray-50/80"
        onClick={onOpen}
      >
        <FolderOpen className="h-4 w-4" />
        Open
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-9 bg-white hover:bg-gray-50/80"
        onClick={onSave}
      >
        <Save className="h-4 w-4" />
        Save
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-9 bg-white hover:bg-gray-50/80"
        onClick={onNew}
      >
        <FileX className="h-4 w-4" />
        New
      </Button>
    </div>
  );
}