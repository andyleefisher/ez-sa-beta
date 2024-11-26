import { useEffect } from 'react';
import { TopNav } from './TopNav';
import { NavControls } from './NavControls';
import { FileControls } from './FileControls';
import { FileDialog } from './FileDialog';
import { SaveDialog } from './SaveDialog';
import { CanvasContent } from './components/CanvasContent';
import { useCanvas } from '@/hooks/useCanvas';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

export function InfiniteCanvas() {
  const {
    zoom,
    openDialog,
    saveDialog,
    plans,
    cards,
    loading,
    cardsError,
    setOpenDialog,
    setSaveDialog,
    handleAddCard,
    handleZoomIn,
    handleZoomOut,
    handleOpenPlan,
    handleSavePlan,
    handleNewPlan,
    handleSaveConfirm,
    handleDeletePlan,
    handleLoadPlan,
    updateCard,
    deleteCard,
    moveCard
  } = useCanvas();

  const { toast } = useToast();

  useEffect(() => {
    if (cardsError) {
      toast({
        title: "Error",
        description: cardsError,
        variant: "destructive",
      });
    }
  }, [cardsError, toast]);

  const handleScreenshot = async () => {
    try {
      const element = document.querySelector('.app-container') as HTMLElement;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#f8fafc', // Match the background color
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        foreignObjectRendering: true,
      });

      const link = document.createElement('a');
      link.download = 'essay-plan.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Success",
        description: "Screenshot saved successfully!",
      });
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
    <div className="app-container h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50/50 to-gray-50/50 flex flex-col">
      <TopNav>
        <div className="flex-1 flex items-center">
          <FileControls
            onOpen={handleOpenPlan}
            onSave={handleSavePlan}
            onNew={handleNewPlan}
          />
          <NavControls
            onAddCard={handleAddCard}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onScreenshot={handleScreenshot}
          />
        </div>
      </TopNav>

      <FileDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        plans={plans}
        onSelect={handleLoadPlan}
        onDelete={handleDeletePlan}
        loading={loading}
      />

      <SaveDialog
        open={saveDialog}
        onOpenChange={setSaveDialog}
        onSave={handleSaveConfirm}
        loading={loading}
      />

      <CanvasContent
        zoom={zoom}
        cards={cards}
        updateCard={updateCard}
        deleteCard={deleteCard}
        moveCard={moveCard}
      />
    </div>
  );
}