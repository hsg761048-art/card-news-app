import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { CardNews } from '@/types';

const COLLECTION = 'cardNews';

export async function saveCardNews(uid: string, data: Omit<CardNews, 'id' | 'uid' | 'savedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    uid,
    savedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function loadCardNewsList(uid: string): Promise<CardNews[]> {
  const q = query(
    collection(db, COLLECTION),
    where('uid', '==', uid),
    orderBy('savedAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      uid: data.uid,
      category: data.category,
      cards: data.cards,
      cardImages: data.cardImages,
      text: data.text,
      savedAt: (data.savedAt as Timestamp).toMillis(),
    } as CardNews;
  });
}

export async function deleteCardNews(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
