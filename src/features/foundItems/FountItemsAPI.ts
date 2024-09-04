import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, updateDoc, } from 'firebase/firestore';
import { type FoundItem } from './foundItemsSlice';
import { type AppDispatch } from "../../app/store";
import { db, storage } from '../../utils/firebase';

export const uploadPhoto = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `photos/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};

export const addFoundItem = async (item: FoundItem, dispatch: AppDispatch) => {
    const docRef = await addDoc(collection(db, "foundItems"), item);
    const itemId = docRef.id;
    // Firestore'dan gelen ID ile item'ı güncelle
    await updateDoc(docRef, { id: itemId });
};


export const removeFoundItem = async (id: string, photoUrl: string, barcodePhotoUrl?: string) => {
    try {
        // Firestore'dan item'ı sil
        const itemDoc = doc(db, 'foundItems', id);
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


export const getFoundItemsByUser = async (email: string) => {
    const q = query(collection(db, 'foundItems'), where('postedBy', '==', email));
    const querySnapshot = await getDocs(q);
    const items: FoundItem[] = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as FoundItem);
    });
    return items;
};
