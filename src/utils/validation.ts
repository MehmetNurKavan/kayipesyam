import type { MatchingItem } from '../features/matching/matchingSlice';

// MatchingItem verilerini doğrulayan bir fonksiyon
export const validateMatchingItem = (item: MatchingItem): boolean => {
    if (!item.id || typeof item.id !== 'string') return false;
    if (!item.lostItemId || typeof item.lostItemId !== 'string') return false;
    if (!item.foundItemId || typeof item.foundItemId !== 'string') return false;
    if (!item.status || typeof item.status !== 'string') return false;
    if (!item.matchedAt || typeof item.matchedAt !== 'string') return false;
    return true;
};
