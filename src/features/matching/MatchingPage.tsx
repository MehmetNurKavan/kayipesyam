import type React from 'react';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../utils/firebase';
import styles from './matching.module.css';
import { type LostItem } from '../lostItems/lostItemsSlice';
import { type FoundItem } from '../foundItems/foundItemsSlice';
import { type Match } from './matchingSlice';

const MatchingPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [matches, setMatches] = useState<Match[]>([]);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    setIsAuthenticated(true);
                    const userEmail = user.email;

                    const lostItemsSnapshot = await getDocs(collection(db, 'lostItems'));
                    const foundItemsSnapshot = await getDocs(collection(db, 'foundItems'));

                    const lostItems: LostItem[] = lostItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LostItem));
                    const foundItems: FoundItem[] = foundItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoundItem));

                    const matches: Match[] = lostItems
                        .map(lostItem => {
                            const matchedItem = foundItems.find(foundItem => foundItem.id === lostItem.id);
                            if (matchedItem && (lostItem.postedBy === userEmail || matchedItem.postedBy === userEmail)) {
                                return {
                                    lostItemId: lostItem.id,
                                    foundItemId: matchedItem.id,
                                    lostItem: lostItem,
                                    foundItem: matchedItem
                                };
                            }
                            return null;
                        })
                        .filter((match): match is Match => match !== null);

                    setMatches(matches);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth]);

    const handleStartMessaging = (lostItemEmail: string, foundItemEmail: string) => {
        navigate('/messaging', {
            state: {
                user1Email: lostItemEmail,
                user2Email: foundItemEmail,
            },
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div>Please log in to view matches.</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Eşleştirilen Kayıtlı Eşyanız</h1>
            <ul className={styles.matchList}>
                {matches.map((match: Match) => (
                    <li key={match.lostItemId} className={styles.matchItem}>
                        <h2>Eşleşme ID: {match.lostItemId}</h2>
                        <div className={styles.itemDetails}>
                            <div className={styles.lostItem}>
                                <h3>Kayıp Eşya</h3>
                                <p>Tür: {match.lostItem.itemType}</p>
                                <p>ID: {match.lostItemId}</p>
                                <p>Paylaşan: {match.lostItem.postedBy}</p>
                                <p>Telefon: {match.lostItem.phone}</p>
                                <p>Kayıp Yer: {match.lostItem.lostLocation}</p>
                                <p>Mevcut Konum: {match.lostItem.personalLocation}</p>
                                <div className={styles.itemImages}>
                                    {match.lostItem.photoUrl && <img src={match.lostItem.photoUrl} alt="Lost Item" />}
                                    {match.lostItem.barcodePhotoUrl && <img src={match.lostItem.barcodePhotoUrl} alt="Barcode" />}
                                </div>
                            </div>
                            <div className={styles.foundItem}>
                                <h3>Bulunan Eşya</h3>
                                <p>Tür: {match.foundItem.itemType}</p>
                                <p>ID: {match.foundItemId}</p>
                                <p>Paylaşan: {match.foundItem.postedBy}</p>
                                <p>Telefon: {match.foundItem.phone}</p>
                                <p>Bulunan Yer: {match.foundItem.foundLocation}</p>
                                <p>Mevcut Konum: {match.foundItem.currentLocation}</p>
                                <div className={styles.itemImages}>
                                    {match.foundItem.photoUrl && <img src={match.foundItem.photoUrl} alt="Found Item" />}
                                    {match.foundItem.barcodePhotoUrl && <img src={match.foundItem.barcodePhotoUrl} alt="Barcode" />}
                                </div>
                                <button
                                    className={styles.messageButton}
                                    onClick={() => handleStartMessaging(match.lostItem.postedBy, match.foundItem.postedBy)}
                                >
                                    Mesajlaşmaya Başla
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchingPage;