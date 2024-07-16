PromotionsCardList
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardList from './CardList';

const PromotionsCardList = () => {
    const [cards, setCards] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [promotionsToChange, setPromotionsToChange] = useState({});

    const cardsPerPage = 3;

    useEffect(() => {
        if (cards.length == 0) {
            fetchCards(0, cardsPerPage);
        }
    }, [cards]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalCards / cardsPerPage));
    }, [cardsPerPage, totalCards]);

    const fetchCards = async (startIdx, endIdx) => {
        if (cards.length > startIdx) {
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
            return;
        }
        try {
            const response = await axios.post('/api/search', { startIdx, endIdx });
            setTotalCards(response.data.total);
            setTotalPages(Math.ceil(response.data.total / cardsPerPage));
            if (response.data.total === 0) {
                return;
            }
            setCards(prevCards => [...prevCards, ...response.data.rows]);
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        const startIdx = (page - 1) * cardsPerPage;
        const endIdx = page * cardsPerPage;
        fetchCards(startIdx, endIdx);
    };

    const togglePromotion = (id, value) => {
        setPromotionsToChange({
            ...promotionsToChange,
            [id]: value,
        });
    };

    const savePromotions = async () => {
        try {
            const response = await axios.post('/api/promotions', { data: promotionsToChange });
            setPromotionsToChange({});
            setCards([]);
            setCurrentPage(1);
            fetchCards(0, cardsPerPage);
        } catch (error) {
            console.error('Error updating promotions:', error);
        }
    };

    return (
        <>
            <CardList
                modifier="promotions"
                cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalCards={totalCards}
                togglePromotion={togglePromotion}
            />

            {Object.keys(promotionsToChange).length > 0 && (
                <button className="button" type="button" onClick={savePromotions}>Сохранить изменения</button>
            )}
        </>
    );
};

export default PromotionsCardList;

