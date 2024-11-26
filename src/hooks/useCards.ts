import { useState, useEffect } from 'react';
import { db, isDevelopment } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where,
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  serverTimestamp
} from 'firebase/firestore';

interface Card {
  id: string;
  type: 'title' | 'idea' | 'evidence' | 'analysis';
  content: string;
  columnId: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export const useCards = (userId?: string) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (isDevelopment) {
      const storedCards = localStorage.getItem('cards');
      if (storedCards) {
        try {
          setCards(JSON.parse(storedCards));
        } catch (err) {
          console.error('Error loading stored cards:', err);
        }
      }
      return;
    }

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
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up cards listener:', err);
      setError('Error connecting to database. Please try again.');
    }
  }, [userId]);

  const addCard = async (card: Omit<Card, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return;

    try {
      const cardData = {
        ...card,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (isDevelopment) {
        const newCard = {
          id: Math.random().toString(36).substr(2, 9),
          ...cardData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        localStorage.setItem('cards', JSON.stringify(updatedCards));
        return;
      }

      await addDoc(collection(db, 'cards'), cardData);
      setError(null);
    } catch (err) {
      console.error('Error adding card:', err);
      setError('Error creating card. Please try again.');
    }
  };

  const updateCard = async (cardId: string, updates: Partial<Card>) => {
    if (!userId) return;

    try {
      if (isDevelopment) {
        const updatedCards = cards.map(card => 
          card.id === cardId ? { ...card, ...updates, updatedAt: new Date().toISOString() } : card
        );
        setCards(updatedCards);
        localStorage.setItem('cards', JSON.stringify(updatedCards));
        return;
      }

      const cardRef = doc(db, 'cards', cardId);
      await updateDoc(cardRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      setError(null);
    } catch (err) {
      console.error('Error updating card:', err);
      setError('Error updating card. Please try again.');
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!userId) return;

    try {
      if (isDevelopment) {
        const updatedCards = cards.filter(card => card.id !== cardId);
        setCards(updatedCards);
        localStorage.setItem('cards', JSON.stringify(updatedCards));
        return;
      }

      await deleteDoc(doc(db, 'cards', cardId));
      setError(null);
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Error deleting card. Please try again.');
    }
  };

  const moveCard = async (cardId: string, targetColumnId: string) => {
    if (!userId) return;

    try {
      if (isDevelopment) {
        const updatedCards = cards.map(card =>
          card.id === cardId ? { ...card, columnId: targetColumnId, updatedAt: new Date().toISOString() } : card
        );
        setCards(updatedCards);
        localStorage.setItem('cards', JSON.stringify(updatedCards));
        return;
      }

      const cardRef = doc(db, 'cards', cardId);
      await updateDoc(cardRef, { 
        columnId: targetColumnId,
        updatedAt: serverTimestamp()
      });
      setError(null);
    } catch (err) {
      console.error('Error moving card:', err);
      setError('Error moving card. Please try again.');
    }
  };

  const replaceAllCards = (newCards: Card[]) => {
    if (isDevelopment) {
      localStorage.setItem('cards', JSON.stringify(newCards));
    }
    setCards(newCards);
  };

  return { 
    cards, 
    addCard, 
    updateCard,
    deleteCard,
    moveCard,
    setCards: replaceAllCards,
    error 
  };
};