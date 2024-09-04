import type React from "react";
import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import styles from "./request.module.css";
import turkiyeIlleriVeIlceler from '../../utils/il-ilce';
import { itemTypes } from "../../utils/constants";
import { addRequestItem, uploadPhoto } from './RequestAPI';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { type RequestItems } from "./requestSlice";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const RequestFormPage: React.FC = () => {
    const { itemId } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    const { itemType, photoUrl, date, city, district, id } = location.state || {};
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [formState, setFormState] = useState({
        productId: "",
        name: "",
        surname: "",
        phone: "",
        lostLocation: "",
        personalLocation: "",
        itemType: "",
        photo: null as File | null,
        barcodePhoto: null as File | null,
        date: "",
        city: "",
        district: "",
        comment: "",
        itemId: id,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    /*     const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsUploading(true);
            try {
                await dispatch(submitRequest({ ...formState, itemId })).unwrap();
                navigate("/notifications");
            } catch (error) {
                console.error("Error submitting request:", error);
            }
        }; */

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
                const newItem: RequestItems = {
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
                    comment: formState.comment,
                    itemId: formState.itemId,
                };

                await addRequestItem(newItem);
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
                    district: '',
                    comment: '',
                    itemId: id,
                });
            }
        } catch (error) {
            console.error('Yükleme sırasında bir hata oluştu:', error);
            alert('Yükleme sırasında bir hata oluştu.');
        } finally {
            setIsUploading(false);
            // Kullanıcıdan izin iste
            toast("Yayınlandı", {
                autoClose: 3000, // Bildirimin otomatik kapanma süresi (milisaniye cinsinden)
                position: "bottom-center", // Bildirimin ekranın üst sağ köşesinde görünmesi
            });
            navigate('/')
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Öğe Talebi</h2>
            {photoUrl && (
                <div className={styles.itemDetails}>
                    <img src={photoUrl} alt="Item" className={styles.itemImage} />
                    <div>
                        <strong>{itemType}</strong>
                        <strong>{"id:"}</strong><strong>{id}</strong>
                        <p><strong>Bulunan Tarih:</strong> {date}</p>
                        <p><strong>İl/İlçe:</strong> {city + "/" + district}</p>
                    </div>
                </div>
            )}
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
            <label>
                Ek Yazı :
                <input
                    type="text"
                    name="comment"
                    value={formState.comment}
                    onChange={handleInputChange}
                    required
                />
            </label>
            <button type="submit" disabled={isUploading}>
                {isUploading ? "Yükleniyor..." : "Talebimi Gönder"}
            </button>
        </form>
    );
};

export default RequestFormPage;
