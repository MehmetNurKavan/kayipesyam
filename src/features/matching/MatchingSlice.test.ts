import matchingReducer, { addMatch, removeMatch, type MatchingState, type MatchingItem, updateMatch } from './matchingSlice';

describe('matchingSlice', () => {
    // Başlangıç durumu
    const initialState: MatchingState = { matches: [] };

    // Test: Eşleşme ekleme
    it('should handle addMatch', () => {
        const match: MatchingItem = {
            id: '1',
            lostItemId: 'lost123',
            foundItemId: 'found456',
            matchedAt: new Date().toISOString(),
            status: 'pending' // status alanı eklenmiş olmalı
        };

        // Eşleşme ekleyelim
        const newState = matchingReducer(initialState, addMatch(match));

        // Eşleşmenin eklendiğini doğrulayalım
        expect(newState.matches).toContain(match);
        expect(newState.matches).toHaveLength(1); // Eşleşme sayısı 1 olmalı
    });

    // Test: Eşleşme kaldırma
    it('should handle removeMatch', () => {
        const initialStateWithMatch: MatchingState = {
            matches: [
                {
                    id: '1',
                    lostItemId: 'lost123',
                    foundItemId: 'found456',
                    matchedAt: new Date().toISOString(),
                    status: 'pending' // status alanı eklenmiş olmalı
                }
            ]
        };

        // Eşleşmeyi kaldıralım
        const newState = matchingReducer(initialStateWithMatch, removeMatch('1'));

        // Eşleşmenin kaldırıldığını doğrulayalım
        expect(newState.matches).toHaveLength(0); // Eşleşme sayısı 0 olmalı
    });

    // Test: Eşleşme kaldırma (bulunmayan ID)
    it('should not change state when removing non-existent match', () => {
        const initialStateWithMatch: MatchingState = {
            matches: [
                {
                    id: '1',
                    lostItemId: 'lost123',
                    foundItemId: 'found456',
                    matchedAt: new Date().toISOString(),
                    status: 'pending' // status alanı eklenmiş olmalı
                }
            ]
        };

        // Mevcut olmayan bir eşleşmeyi kaldırmaya çalışalım
        const newState = matchingReducer(initialStateWithMatch, removeMatch('999'));

        // Durumun değişmediğini doğrulayalım
        expect(newState.matches).toHaveLength(1); // Eşleşme sayısı 1 olmalı
    });

    // Test: Eşleşme güncelleme
    it('should handle updateMatch', () => {
        const initialStateWithMatch: MatchingState = {
            matches: [
                {
                    id: '1',
                    lostItemId: 'lost123',
                    foundItemId: 'found456',
                    matchedAt: new Date().toISOString(),
                    status: 'pending' // status alanı eklenmiş olmalı
                }
            ]
        };

        // Güncellenmiş eşleşme bilgileri
        const updatedMatch: MatchingItem = {
            id: '1',
            lostItemId: 'lost123',
            foundItemId: 'found456',
            matchedAt: new Date().toISOString(),
            status: 'matched' // Güncellenmiş status
        };

        // Eşleşmeyi güncelleyelim
        const newState = matchingReducer(initialStateWithMatch, updateMatch(updatedMatch));

        // Eşleşmenin güncellendiğini doğrulayalım
        expect(newState.matches).toContainEqual(updatedMatch);
        expect(newState.matches).toHaveLength(1); // Eşleşme sayısı 1 olmalı
    });
});
