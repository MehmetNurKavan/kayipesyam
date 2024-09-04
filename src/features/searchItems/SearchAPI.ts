import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, limit, startAfter, orderBy } from "firebase/firestore";

// Firebase'den veri çekme fonksiyonu
export const fetchItemsFromFirebase = async (filters: any) => {
    const collectionName = filters.itemCategory || "foundItems"; // Kategoriye göre koleksiyon ismi belirle
    const itemsRef = collection(db, collectionName);
    let q = query(itemsRef);

    // Filtreleme işlemleri
    if (filters.city) {
        q = query(q, where("city", "==", filters.city));
    }
    if (filters.district) {
        q = query(q, where("district", "==", filters.district));
    }
    if (filters.itemType) {
        q = query(q, where("itemType", "==", filters.itemType));
    }
    if (filters.dateRange?.start && filters.dateRange?.end) {
        q = query(
            q,
            where("date", ">=", filters.dateRange.start),
            where("date", "<=", filters.dateRange.end)
        );
    }

    // Sıralama işlemleri
    if (filters.sortOption === "location-az") {
        q = query(q, orderBy("city", "asc"));
    } else if (filters.sortOption === "location-za") {
        q = query(q, orderBy("city", "desc"));
    } else if (filters.sortOption === "date-asc") {
        q = query(q, orderBy("date", "asc"));
    } else if (filters.sortOption === "date-desc") {
        q = query(q, orderBy("date", "desc"));
    }

    // Sayfalama işlemleri
    const itemsPerPage = 30;
    let pageQuery = query(q, limit(itemsPerPage));

    if (filters.page > 1) {
        // Önceki sayfanın son öğesini bul
        const previousPageLastItem = await getDocs(
            query(itemsRef, limit(itemsPerPage * (filters.page - 1)))
        );
        const lastVisible = previousPageLastItem.docs[previousPageLastItem.docs.length - 1];
        pageQuery = query(q, startAfter(lastVisible), limit(itemsPerPage));
    }

    const querySnapshot = await getDocs(pageQuery);
    const items: any[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Toplam öğe sayısını hesapla
    const totalItemsSnapshot = await getDocs(itemsRef);
    const totalItems = totalItemsSnapshot.size;

    return { items, totalItems };
};
