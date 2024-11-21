import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, DocumentData } from 'firebase/firestore';

interface Card {
  id: string;
  type: 'idea' | 'evidence' | 'analysis';
  content: string;
  position: { x: number; y: number };
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export const useCards = (userId: string | undefined) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    try {
      const q = query(
        collection(db, 'cards'), 
        where('userId', '==', userId)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        try {
          const newCards = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Card));
          setCards(newCards);
          setError(null);
        } catch (err) {
          console.error('Error processing cards:', err);
          setError('Error processing cards data. Please refresh the page.');
        }
      }, (err) => {
        console.error('Firestore error:', err);
        if (err.code === 'permission-denied') {
          setError('Access denied. Please sign out and sign in again.');
        } else {
          setError('Error loading cards. Please try again.');
        }
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up cards listener:', err);
      setError('Error connecting to database. Please try again.');
    }
  }, [userId]);

  const addCard = async (card: Omit<Card, 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) {
      setError('You must be signed in to add cards.');
      return;
    }

    try {
      const cardData = {
        ...card,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'cards'), cardData);
      setError(null);
    } catch (err) {
      console.error('Error adding card:', err);
      setError('Error creating card. Please try again.');
    }
  };

  const moveCard = async (cardId: string, newPosition: { x: number; y: number }) => {
    if (!userId) {
      setError('You must be signed in to move cards.');
      return;
    }

    try {
      const cardRef = doc(db, 'cards', cardId);
      await updateDoc(cardRef, { 
        position: newPosition,
        updatedAt: serverTimestamp()
      });
      setError(null);
    } catch (err) {
      console.error('Error moving card:', err);
      setError('Error moving card. Please try again.');
    }
  };

  return { cards, addCard, moveCard, error };
};