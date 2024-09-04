import type React from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import styles from "./search.module.css";
import type { RootState } from "../../app/store";
import { fetchItems } from "./searchSlice";
import { SearchFilters } from "./SearchFilters";
import { SearchResults } from "./SearchResults";

export const SearchPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const items = useAppSelector((state: RootState) => state.search.items);
    const totalItems = useAppSelector((state: RootState) => state.search.totalItems);
    const [filters, setFilters] = useState({
        city: "",
        district: "",
        itemType: "",
        dateRange: { start: "", end: "" },
        sortOption: "date-desc",
        page: 1,
        itemCategory: "foundItems",
    });

    const itemsPerPage = 20;

    useEffect(() => {
        console.log('Filters:', filters);
        dispatch(fetchItems(filters));
    }, [filters, dispatch]);

    const handlePageChange = (newPage: number) => {
        setFilters(prevFilters => ({ ...prevFilters, page: newPage }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <SearchFilters filters={filters} setFilters={setFilters} />
            </div>
            <div className={styles.results}>
                <SearchResults items={items} />
            </div>
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                >
                    Önceki
                </button>
                <span>
                    Sayfa {filters.page} / {Math.ceil(totalItems / itemsPerPage)}
                </span>
                <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === Math.ceil(totalItems / itemsPerPage)}
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
};

export default SearchPage;
