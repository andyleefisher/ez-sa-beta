import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Plan {
  id: string;
  title: string;
  createdAt: any;
}

interface FileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plans: Plan[];
  onSelect: (planId: string) => Promise<void>;
  onDelete: (planId: string) => Promise<void>;
  loading?: boolean;
}

export function FileDialog({
  open,
  onOpenChange,
  plans,
  onSelect,
  onDelete,
  loading = false,
}: FileDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelect = async () => {
    if (!selectedId || !onSelect || isProcessing) return;
    
    try {
      setIsProcessing(true);
      await onSelect(selectedId);
      onOpenChange(false);
      setSelectedId(null);
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete || isProcessing) return;

    try {
      setIsProcessing(true);
      await onDelete(planId);
      if (planId === selectedId) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Open Plan</DialogTitle>
          <DialogDescription>
            Select an essay plan to open
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          {loading || isProcessing ? (
            <div className="text-center py-4">Loading...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No saved plans found
            </div>
          ) : (
            <div className="space-y-2">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center ${
                    selectedId === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedId(plan.id)}
                >
                  <div>
                    <h4 className="text-sm font-medium">{plan.title || 'Untitled Plan'}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(plan.createdAt?.seconds * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => handleDelete(plan.id, e)}
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedId(null);
            }}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedId || isProcessing}
          >
            {isProcessing ? 'Opening...' : 'Open'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}