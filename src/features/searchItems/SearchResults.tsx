import type React from "react";
import { useNavigate } from "react-router-dom";

interface Item {
    id: string;
    itemType: string;
    photoUrl: string;
    date: string;
    city: string;
    district: string;
}

interface SearchResultsProps {
    items: Item[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ items }) => {
    console.log("Received items in SearchResults:", items);
    const navigate = useNavigate();
    const handleRequestClick = (item: Item) => {
        navigate(`/request/${item.id}`, {
            state: {
                id: item.id,
                itemType: item.itemType,
                photoUrl: item.photoUrl,
                date: item.date,
                city: item.city,
                district: item.district,
            },
        });
    };
    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} style={{
                        border: "1px solid #ccc",
                        margin: "10px",
                        padding: "10px",
                        width: "200px",
                        textAlign: "center"
                    }}>
                        <img src={item.photoUrl} alt="Item" style={{ width: "100px", height: "100px" }} />
                        <h1>{item.itemType}</h1>
                        <p>Konum: {item.city + "/" + item.district}</p>
                        <p>Tarih: {item.date}</p>
                        <button onClick={() => handleRequestClick(item)}>Öğeyi Talep Et</button>
                    </div>
                ))
            ) : (
                <p>Henüz hiçbir eşya bulunamadı.</p>
            )}
        </div>
    );
};
