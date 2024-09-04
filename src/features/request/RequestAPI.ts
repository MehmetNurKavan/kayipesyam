import { db, storage } from '../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import type { RequestItems } from "./requestSlice";

export const addRequestItem = async (item: RequestItems) => {
    const docRef = await addDoc(collection(db, "requestItems"), item);
    const itemId = docRef.id;
    // Firestore'dan gelen ID ile item'ı güncelle
    await updateDoc(docRef, { id: itemId });
};

export const uploadPhoto = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `photos/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};