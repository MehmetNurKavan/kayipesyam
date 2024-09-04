import type React from 'react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addItem, removeItem, setItems, type LostItem } from './lostItemsSlice';
import styles from './lostItems.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addLostItem, uploadPhoto, removeLostItem, getLostItemsByUser } from './LostItemsAPI';
import { itemTypes } from '../../utils/constants';
import turkiyeIlleriVeIlceler from '../../utils/il-ilce';


const LostItemsPage: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formState, setFormState] = useState({
        name: '',
        surname: '',
        phone: '',
        lostLocation: '',
        personalLocation: '',
        itemType: '',
        photo: null as File | null,
        productId: '',
        barcodePhoto: null as File | null,
        date: '',
        city: '',
        district: ''
    });

    const dispatch = useAppDispatch();
    const items = useAppSelector(state => state.lostItems.items);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userItems = await getLostItemsByUser(user.email || '');
                dispatch(setItems(userItems));
            } else {
                setIsAuthenticated(false);
                navigate('/auth');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, navigate, dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.files) {
            const files = e.target.files;
            setFormState(prevState => ({ ...prevState, [name]: files[0] }));
        } else {
            setFormState(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Yükleme durumunu başlat
        if (isUploading) return; // Eğer yükleme zaten devam ediyorsa, işlemi durdur

        setIsUploading(true);
        setUploadSuccess(false);;

        try {
            if (!formState.photo) {
                alert("Lütfen bir eşya fotoğrafı yükleyin.");
                return;
            }

            let photoUrl = '';
            let barcodePhotoUrl = '';

            if (formState.photo) {
                photoUrl = await uploadPhoto(formState.photo);
            }

            if (formState.barcodePhoto) {
                barcodePhotoUrl = await uploadPhoto(formState.barcodePhoto);
            }

            const user = auth.currentUser;

            if (user) {
                const newItem: LostItem = {
                    id: formState.productId,
                    name: formState.name,
                    surname: formState.surname,
                    phone: formState.phone,
                    lostLocation: formState.lostLocation,
                    personalLocation: formState.personalLocation,
                    itemType: formState.itemType,
                    photoUrl,
                    barcodePhotoUrl,
                    postedBy: user.email || 'unknown',
                    date: formState.date,
                    city: formState.city,
                    district: formState.district,
                };

                dispatch(addItem(newItem));
                await addLostItem(newItem);
                setFormState({
                    name: '',
                    surname: '',
                    phone: '',
                    lostLocation: '',
                    personalLocation: '',
                    itemType: '',
                    photo: null,
                    productId: '',
                    barcodePhoto: null,
                    date: '',
                    city: '',
                    district: ''
                });
            }
        } catch (error) {
            console.error('Yükleme sırasında bir hata oluştu:', error);
            alert('Yükleme sırasında bir hata oluştu.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRequestClick = (item: { id: string }) => {
        navigate(`/lost-items/${item.id}`, {
            state: {
                id: item.id
            },
        });
    };

    const handleRemoveItem = async (id: string, photoUrl: string, barcodePhotoUrl?: string) => {
        try {
            await removeLostItem(id, photoUrl, barcodePhotoUrl);
            // Silme işlemi başarılı, gerekli durum güncellemelerini yapın
            dispatch(removeItem(id));
        } catch (error) {
            console.error('Error removing item:', error);
            // Hata durumunda kullanıcıya bilgi verebilirsiniz
        }
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (!isAuthenticated) {
        return <div>Yetkisiz erişim. Lütfen giriş yapın.</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Kayıp Eşya İlanı</h1>
            {/* Yükleme animasyonu ve başarı mesajı */}
            {isUploading && <div className={styles.loading}>Yükleniyor...</div>}
            {uploadSuccess && <div className={styles.success}>Paylaşıldı!</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="İsim"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="surname"
                    placeholder="Soyisim"
                    value={formState.surname}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Telefon Numarası"
                    value={formState.phone}
                    onChange={handleInputChange}
                    required
                />
                <label>
                    Şehir :
                    <select name="city" value={formState.city} onChange={handleInputChange} required>
                        <option value="">Şehir Seçin</option>
                        {turkiyeIlleriVeIlceler.map(il => (
                            <option key={il.il} value={il.il}>{il.il}</option>
                        ))}
                    </select>
                </label>
                <label>
                    İlçe :
                    <select name="district" value={formState.district} onChange={handleInputChange} required>
                        <option value="">İlçe Seçin</option>
                        {turkiyeIlleriVeIlceler.find(il => il.il === formState.city)?.ilceler.map(ilce => (
                            <option key={ilce.ilce} value={ilce.ilce}>{ilce.ilce}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Kaybedilen Yer :
                    <input
                        type="text"
                        name="lostLocation"
                        placeholder="Örnek: Halkalı mah. Çiçek sokak. Mavi Market önü"
                        value={formState.lostLocation}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Kişisel Konum :
                    <input
                        type="text"
                        name="personalLocation"
                        placeholder="Örnek: Halkalı mah. Çiçek sokak. Mavi Market"
                        value={formState.personalLocation}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Eşya Türü:
                    <input
                        type="text"
                        name="itemType"
                        list="itemTypesList"
                        placeholder="Eşya türünü yazın"
                        value={formState.itemType}
                        onChange={handleInputChange}
                        required
                    />
                    <datalist id="itemTypesList">
                        {itemTypes.map(type => (
                            <option key={type} value={type} />
                        ))}
                    </datalist>
                </label>
                <label>
                    Eşya Fotoğrafı :
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Ürün id (Opsiyonel)
                    <input
                        type="text"
                        name="productId"
                        placeholder="Varsa ürünün benzersiz kimliğini yazın"
                        value={formState.productId}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Barkod Fotoğrafı (Opsiyonel) :
                    <input
                        type="file"
                        name="barcodePhoto"
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Kaybedilen Tarih :
                    <input
                        type="date"
                        name="date"
                        value={formState.date}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit" disabled={isUploading}>
                    {isUploading ? "Yükleniyor..." : "İlan Ver"}
                </button>
            </form>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <div className={styles['item-details']}>
                            <h2>Tür: {item.itemType}</h2>
                            <p>ID: {item.id}</p>
                            <p>Ürün ID: {item.productId || 'Yok'}</p>
                            <p>Ad: {item.name}</p>
                            <p>Soyad: {item.surname}</p>
                            <p>Telefon: {item.phone}</p>
                            <p>Tarih: {item.date}</p>
                            <p>Şehir: {item.city}</p>
                            <p>İlçe: {item.district}</p>
                            <p>Kaybedilen Yer: {item.lostLocation}</p>
                            <p>Kişisel Konum: {item.personalLocation}</p>
                            <p>Paylaşan: {item.postedBy}</p>
                            <div className={styles['item-images']}>
                                <img src={item.photoUrl} alt={item.name} />
                                {item.barcodePhotoUrl && <img src={item.barcodePhotoUrl} alt="Barkod" />}
                            </div>
                        </div>
                        <div className={styles['buttons-container']}>
                            {item.id ? (
                                <button onClick={() => handleRequestClick({ id: item.id! })}>Başvuruları<br />Görüntüle</button>
                            ) : (
                                <p></p>
                            )}
                            <button onClick={() => item.id && handleRemoveItem(item.id, item.photoUrl, item.barcodePhotoUrl)}>Sil</button>
                        </div>
                    </li>

                ))}
            </ul>
        </div>
    );
};

export default LostItemsPage;
