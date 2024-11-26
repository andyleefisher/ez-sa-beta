import { useState } from 'react';
import { db, isDevelopment } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query,
  where, 
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

interface Plan {
  id: string;
  title: string;
  cards: any[];
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export const usePlans = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePlan = async (title: string, cards: any[]) => {
    if (!userId) throw new Error('User must be signed in to save plans');

    setLoading(true);
    setError(null);

    try {
      const planData = {
        title,
        cards,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'plans'), planData);
      return docRef.id;
    } catch (err) {
      console.error('Error saving plan:', err);
      throw new Error('Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const loadPlan = async (planId: string): Promise<Plan> => {
    if (!userId) throw new Error('User must be signed in to load plans');

    setLoading(true);
    setError(null);

    try {
      const planRef = doc(db, 'plans', planId);
      const snapshot = await getDoc(planRef);
      
      if (!snapshot.exists()) {
        throw new Error('Plan not found');
      }

      const plan = {
        id: snapshot.id,
        ...snapshot.data()
      } as Plan;

      // Ensure the plan belongs to the current user
      if (plan.userId !== userId) {
        throw new Error('Unauthorized access');
      }

      return plan;
    } catch (err) {
      console.error('Error loading plan:', err);
      throw new Error('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async (): Promise<Plan[]> => {
    if (!userId) throw new Error('User must be signed in to load plans');

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'plans'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Plan));
    } catch (err) {
      console.error('Error loading plans:', err);
      throw new Error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!userId) throw new Error('User must be signed in to delete plans');

    setLoading(true);
    setError(null);

    try {
      const planRef = doc(db, 'plans', planId);
      const snapshot = await getDoc(planRef);
      
      if (!snapshot.exists()) {
        throw new Error('Plan not found');
      }

      // Ensure the plan belongs to the current user
      if (snapshot.data()?.userId !== userId) {
        throw new Error('Unauthorized access');
      }

      await deleteDoc(planRef);
    } catch (err) {
      console.error('Error deleting plan:', err);
      throw new Error('Failed to delete plan');
    } finally {
      setLoading(false);
    }
  };

  return {
    savePlan,
    loadPlan,
    loadPlans,
    deletePlan,
    loading,
    error
  };
};