import type React from 'react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addItem, removeItem, setItems } from './foundItemsSlice';
import styles from './foundItems.module.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addFoundItem, uploadPhoto, removeFoundItem, getFoundItemsByUser } from './FountItemsAPI';
import { itemTypes } from '../../utils/constants';
import turkiyeIlleriVeIlceler from '../../utils/il-ilce';

const FoundItemsPage: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formState, setFormState] = useState({
        name: '',
        surname: '',
        phone: '',
        foundLocation: '',
        currentLocation: '',
        itemType: '',
        photo: null as File | null,
        productId: '',
        barcodePhoto: null as File | null,
        date: '',
        city: '',
        district: ''
    });

    const dispatch = useAppDispatch();
    const items = useAppSelector(state => state.foundItems.items);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                const userItems = await getFoundItemsByUser(user.email || '');
                dispatch(setItems(userItems)); // Eşyaları ayarla
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
        setUploadSuccess(false);

        let photoUrl = '';
        let barcodePhotoUrl = '';

        try {
            if (!formState.photo) {
                alert("Lütfen bir eşya fotoğrafı yükleyin.");
                return;
            }
            if (formState.photo) {
                photoUrl = await uploadPhoto(formState.photo);
            }

            if (formState.barcodePhoto) {
                barcodePhotoUrl = await uploadPhoto(formState.barcodePhoto);
            }

            const user = auth.currentUser;

            if (user) {
                const newItem = {
                    id: formState.productId,
                    name: formState.name,
                    surname: formState.surname,
                    phone: formState.phone,
                    foundLocation: formState.foundLocation,
                    currentLocation: formState.currentLocation,
                    itemType: formState.itemType,
                    photoUrl,
                    barcodePhotoUrl,
                    postedBy: user.email || 'unknown',
                    date: formState.date,
                    city: formState.city,
                    district: formState.district,
                };

                await addFoundItem(newItem, dispatch);
                dispatch(addItem(newItem));
                setUploadSuccess(true);
            } else {
                alert("Kullanıcı bilgisi alınamadı. Lütfen tekrar giriş yapın.");
            }

            // Formu sıfırla
            setFormState({
                name: '',
                surname: '',
                phone: '',
                foundLocation: '',
                currentLocation: '',
                itemType: '',
                photo: null,
                productId: '',
                barcodePhoto: null,
                date: '',
                city: '',
                district: ''
            });

        } catch (error) {
            console.error('Yükleme sırasında bir hata oluştu:', error);
            alert('Yükleme sırasında bir hata oluştu.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRequestClick = (item: { id: string }) => {
        navigate(`/found-items/${item.id}`, {
            state: {
                id: item.id
            },
        });
    };


    const handleRemoveItem = async (id: string, photoUrl: string, barcodePhotoUrl?: string) => {
        try {
            await removeFoundItem(id, photoUrl, barcodePhotoUrl);
            // Silme işlemi başarılı, gerekli durum güncellemelerini yapın
            dispatch(removeItem(id));
        } catch (error) {
            console.error('Error removing item:', error);
            // Hata durumunda kullanıcıya bilgi verebilirsiniz
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <div>Yetkisiz erişim. Lütfen giriş yapın.</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Bulunan Eşya İlanı</h1>
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
                    Bululan Yer :
                    <input
                        type="text"
                        name="foundLocation"
                        placeholder="Örnek: Halkalı mah. Çiçek sokak. Mavi Market önü"
                        value={formState.foundLocation}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Mevcut Konum :
                    <input
                        type="text"
                        name="currentLocation"
                        placeholder="Örnek: Halkalı mah. Martı sokak"
                        value={formState.currentLocation}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Eşya Türü :
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
                <input
                    type="date"
                    name="date"
                    value={formState.date}
                    onChange={handleInputChange}
                    required
                />
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
                            <p>Bulunan Yer: {item.foundLocation}</p>
                            <p>Mevcut Konum: {item.currentLocation}</p>
                            <div className={styles['item-images']}>
                                {item.photoUrl && <img src={item.photoUrl} alt="Eşya Fotoğrafı" />}
                                {item.barcodePhotoUrl && <img src={item.barcodePhotoUrl} alt="Barkod Fotoğrafı" />}
                            </div>
                        </div>
                        <div className={styles['buttons-container']}>
                            {item.id ? (
                                <button onClick={() => handleRequestClick({ id: item.id! })}>Başvuruları Görüntüle</button>
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

export default FoundItemsPage;
