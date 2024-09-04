import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../utils/firebase';
import type { LostItem } from '../lostItems/lostItemsSlice';

export const fetchLostItems = async (): Promise<LostItem[]> => {
    const querySnapshot = await getDocs(collection(db, 'lostItems'));
    return querySnapshot.docs.map(doc => doc.data() as LostItem);
};

export const addLostItem = async (item: LostItem) => {
    const docRef = await addDoc(collection(db, "lostItems"), item);
    const itemId = docRef.id;
    // Firestore'dan gelen ID ile item'ı güncelle
    await updateDoc(docRef, { id: itemId });
};

export const removeLostItem = async (id: string, photoUrl: string, barcodePhotoUrl?: string) => {
    try {
        // Firestore'dan item'ı sil
        const itemDoc = doc(db, 'lostItems', id);
        await deleteDoc(itemDoc);
        console.log(`Document with ID ${id} deleted from Firestore.`);

        // Fotoğrafları sil
        const photoRef = ref(storage, photoUrl);
        await deleteObject(photoRef);
        console.log(`Photo at ${photoUrl} deleted from Firebase Storage.`);

        if (barcodePhotoUrl) {
            const barcodePhotoRef = ref(storage, barcodePhotoUrl);
            await deleteObject(barcodePhotoRef);
            console.log(`Barcode photo at ${barcodePhotoUrl} deleted from Firebase Storage.`);
        }
    } catch (error) {
        console.error('Error removing document or photos: ', error);
        throw error; // Hata fırlatmak, hata yönetimini kolaylaştırır
    }
};


export const uploadPhoto = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `photos/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const getLostItemsByUser = async (email: string) => {
    const q = query(collection(db, 'lostItems'), where('postedBy', '==', email));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as LostItem[];
    return items;
};