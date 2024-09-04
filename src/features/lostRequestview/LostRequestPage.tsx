import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from '../../app/hooks';
import styles from './requestlost.module.css';
import { getAuth } from 'firebase/auth';
import { getRequestItem } from './lostRequestAPI';

const LostRequestPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const [itemDetails, setItemDetails] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const data = await getRequestItem(id);
                    setItemDetails(data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching item details:", error);
                    setError("Öğe detayları yüklenirken bir hata oluştu.");
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [id]);

    const handleStartMessaging = (lostItemEmail: string, foundItemEmail: string) => {
        navigate('/messaging', {
            state: {
                user1Email: lostItemEmail,
                user2Email: foundItemEmail,
            },
        });
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (itemDetails.length === 0) {
        return <div>Öğe bulunamadı.</div>;
    }

    return (
        <div className={styles.requestView}>
            {itemDetails.map((item, index) => (
                <div key={index} className={styles.itemDetails}>
                    <h2>Başvuru Detayları</h2>
                    <img src={item.photoUrl} alt="" className={styles.itemImage} />
                    <div>
                        <p><strong>İsim:</strong> {item.name}</p>
                        <p><strong>Soyisim:</strong> {item.surname}</p>
                        <p><strong>Telefon:</strong> {item.phone}</p>
                        <p><strong>Bulunan Yer:</strong> {item.lostLocation}</p>
                        <p><strong>Kişisel Konum:</strong> {item.personalLocation}</p>
                        <p><strong>Eşya Türü:</strong> {item.itemType}</p>
                        <p><strong>Bulunan Tarih:</strong> {item.date}</p>
                        <p><strong>Şehir:</strong> {item.city}</p>
                        <p><strong>İlçe:</strong> {item.district}</p>
                        <p><strong>Ek Yazı:</strong> {item.comment}</p>
                        {item.barcodePhotoUrl && (
                            <img src={item.barcodePhotoUrl} alt="Barcode" className={styles.itemImage} />
                        )}
                        <button
                            className={styles.messageButton}
                            onClick={() => handleStartMessaging(item.postedBy, currentUser?.email || '')}
                        >
                            Mesajlaşmaya Başla
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LostRequestPage;
