import type React from 'react';
import styles from './searchFilters.module.css';
import turkiyeIlleriVeIlceler from "../../utils/il-ilce";
import { fetchItems } from "./searchSlice";
import { useAppDispatch } from '../../app/hooks';

interface DateRange {
    start: string;
    end: string;
}

type Filters = {
    city: string;
    district: string;
    itemType: string;
    dateRange: { start: string; end: string };
    sortOption: string;
    page: number;
    itemCategory: string;
};

interface SearchFiltersProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, setFilters }) => {

    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("dateRange.")) {
            const field = name.split(".")[1] as keyof DateRange;
            setFilters({
                ...filters,
                dateRange: {
                    ...filters.dateRange,
                    [field]: value
                }
            });
        } else {
            setFilters({
                ...filters,
                [name]: value
            });
        }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCity = e.target.value;
        setFilters({
            ...filters,
            city: selectedCity,
            district: ''
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            itemCategory: category,
            page: 1,
        }));
    };
    const handleSearch = () => {
        dispatch(fetchItems(filters));
    };

    const resetFilters = () => {
        setFilters({
            city: "",
            district: "",
            itemType: "",
            dateRange: { start: "", end: "" },
            sortOption: "date-desc",
            page: 1,
            itemCategory: "foundItems", // Filtreleri sıfırladığımızda tekrar kayıp eşyalara dön
        });
    };

    const availableDistricts = filters.city ?
        turkiyeIlleriVeIlceler.find(il => il.il === filters.city)?.ilceler || [] :
        [];

    return (
        <div className={styles.searchFilters}>
            <div className={styles.row}>
                <div className={styles.label}>
                    <label>Kategori:</label>
                    <select
                        name="itemCategory"
                        value={filters.itemCategory}
                        onChange={handleCategoryChange}
                        className={styles.input}
                    >
                        <option value="foundItems">Bulunan Kayıp Eşyalar</option>
                        <option value="lostItems">Kaybedilen Bulunamayan Eşyalar</option>
                    </select>
                </div>
                <div className={styles.label}>
                    <label>Şehir:</label>
                    <select
                        name="city"
                        value={filters.city}
                        onChange={handleCityChange}
                        className={styles.input}
                    >
                        <option value="">Seçiniz</option>
                        {turkiyeIlleriVeIlceler.map(il => (
                            <option key={il.il} value={il.il}>
                                {il.il}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.label}>
                    <label>İlçe:</label>
                    <select
                        name="district"
                        value={filters.district}
                        onChange={handleInputChange}
                        className={styles.input}
                        disabled={!filters.city}
                    >
                        <option value="">Seçiniz</option>
                        {availableDistricts.map(ilce => (
                            <option key={ilce.ilce} value={ilce.ilce}>
                                {ilce.ilce}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.label}>
                    <label>Sıralama:</label>
                    <select
                        name="sortOption"
                        value={filters.sortOption}
                        onChange={handleInputChange}
                        className={styles.input}
                    >
                        <option value="date-desc">Tarihe Göre Şimdi-Eski</option>
                        <option value="date-asc">Tarihe Göre Eski-Şimdi</option>
                        <option value="location-az">Şehre Göre A-Z</option>
                        <option value="location-za">Şehre Göre Z-A</option>
                    </select>
                </div>
                <div className={styles.compactDateRange}>
                    <label>Zaman Aralığı:</label>
                    <div className={styles.label}>
                        <input
                            type="date"
                            name="dateRange.start"
                            value={filters.dateRange.start}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.label}>
                        <input
                            type="date"
                            name="dateRange.end"
                            value={filters.dateRange.end}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                </div>
                <div className={styles.compactSearchType}>
                    <div className={styles.label}>
                        <label>Eşya Türü:</label>
                        <input
                            type="text"
                            name="itemType"
                            value={filters.itemType}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                    <button onClick={handleSearch}>
                        Ara
                    </button>
                    <button onClick={resetFilters}>
                        Filtreleri Sıfırla
                    </button>
                </div>
            </div>
        </div>
    );
};
