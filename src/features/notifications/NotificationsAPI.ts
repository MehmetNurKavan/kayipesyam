import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import type { Notification } from './notificationsSlice';

export const fetchNotifications = async (): Promise<Notification[]> => {
    const querySnapshot = await getDocs(collection(db, 'notifications'));
    return querySnapshot.docs.map(doc => doc.data() as Notification);
};

export const addNotification = async (notification: Notification) => {
    await addDoc(collection(db, 'notifications'), notification);
};

export const removeNotification = async (id: string) => {
    await deleteDoc(doc(db, 'notifications', id));
};
