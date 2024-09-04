import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const getRequestItem = async (itemId: string) => {
    const q = query(
        collection(db, "requestItems"),
        where("itemId", "==", itemId)
    );

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    if (items.length > 0) {
        return items;
    } else {
        throw new Error("No documents found!");
    }
};
