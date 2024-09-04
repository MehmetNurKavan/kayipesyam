import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase'; // Firebase yapılandırmasını içeren dosya
import type { Match } from './matchingSlice';

// Tüm eşleşmeleri almak için
export const fetchMatches = async (): Promise<Match[]> => {
    try {
        const response = await getDocs(collection(db, 'matches'));
        const matches: Match[] = response.docs.map(doc => doc.data() as Match);
        console.log('Fetched Matches:', matches); // Log ekledik
        return matches;
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
};

// Yeni bir eşleşme eklemek için
export const addMatch = async (item: Match) => {
    try {
        await addDoc(collection(db, 'matches'), item);
    } catch (error) {
        console.error('Error adding match:', error);
    }
};

// Bir eşleşmeyi silmek için
export const removeMatch = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'matches', id));
    } catch (error) {
        console.error('Error deleting match:', error);
    }
};

// Belirli bir eşleşmenin detaylarını almak için
export const fetchMatchDetails = async (id: string): Promise<Match | undefined> => {
    const matchDoc = doc(db, 'matches', id);
    const matchSnapshot = await getDoc(matchDoc);
    if (matchSnapshot.exists()) {
        return matchSnapshot.data() as Match;
    } else {
        console.error('No such document!');
        return undefined;
    }
};

// Tüm eşleşmeleri yeniden almak için
export const fetchAllMatches = async (): Promise<Match[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'matches'));
        return querySnapshot.docs.map(doc => doc.data() as Match);
    } catch (error) {
        console.error('Error fetching all matches:', error);
        return [];
    }
};
/*
Firebase Firestore'dan eşleşme verilerini almak, eklemek ve silmek için gerekli API fonksiyonlarını içerir.
fetchMatches: Tüm eşleşmeleri getirir.
addMatch: Yeni bir eşleşme ekler.
removeMatch: Bir eşleşmeyi siler.
fetchMatchDetails: Belirli bir eşleşmenin detaylarını getirir.
fetchAllMatches: Tüm eşleşmeleri yeniden getirir.
*/