import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCards } from '@/hooks/useCards';
import { usePlans } from '@/hooks/usePlans';

export const useCanvas = () => {
  const [zoom, setZoom] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { cards, addCard, updateCard, deleteCard, moveCard, error: cardsError } = useCards(user?.uid);
  const { savePlan, loadPlans, deletePlan, loading } = usePlans(user?.uid);
  const { toast } = useToast();

  const handleAddCard = useCallback(async (type: 'title' | 'idea' | 'evidence' | 'analysis') => {
    try {
      const newCard = {
        type,
        content: '',
        columnId: 'landing-pad'
      };

      await addCard(newCard);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add card. Please try again.",
        variant: "destructive",
      });
    }
  }, [addCard, toast]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleOpenPlan = useCallback(async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to open plans.",
        variant: "destructive",
      });
      return;
    }

    try {
      const userPlans = await loadPlans();
      setPlans(userPlans);
      setOpenDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load plans. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, loadPlans, toast]);

  const handleSavePlan = useCallback(() => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save plans.",
        variant: "destructive",
      });
      return;
    }
    setSaveDialog(true);
  }, [user, toast]);

  const handleNewPlan = useCallback(() => {
    if (cards && cards.length > 0) {
      if (confirm('Are you sure you want to start a new plan? All unsaved changes will be lost.')) {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  }, [cards]);

  const handleSaveConfirm = useCallback(async (title: string) => {
    try {
      await savePlan(title, cards || []);
      toast({
        title: "Success",
        description: "Plan saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      });
    }
  }, [cards, savePlan, toast]);

  const handleDeletePlan = useCallback(async (planId: string) => {
    try {
      await deletePlan(planId);
      const updatedPlans = await loadPlans();
      setPlans(updatedPlans);
      toast({
        title: "Success",
        description: "Plan deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
    }
  }, [deletePlan, loadPlans, toast]);

  return {
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
    updateCard,
    deleteCard,
    moveCard
  };
};