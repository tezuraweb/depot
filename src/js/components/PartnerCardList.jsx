import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../includes/Card';
import IconSprite from '../includes/IconSprite';
import { useViewportContext } from '../utils/ViewportContext';

const PartnerCardList = () => {
    const deviceType = useViewportContext();
    const [cards, setCards] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const cardsPerPage = deviceType === 'desktop' ? 3 : deviceType === 'laptop' ? 2 : 1;
    const deviceIsDesktop = deviceType === 'desktop' || deviceType === 'laptop';

    useEffect(() => {
        fetchTotalCards();
        fetchCards(0, cardsPerPage);
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(totalCards / cardsPerPage));
    }, [cardsPerPage, totalCards]);

    useEffect(() => {
        const startIdx = (currentPage - 1) * cardsPerPage;
        const endIdx = currentPage * cardsPerPage;
        if (cards.length > startIdx && cards.length < endIdx) {
            fetchCards(cards.length, endIdx);
        }
    }, [deviceType]);

    const fetchTotalCards = async () => {
        try {
            const response = await axios.get('/api/partners/count');
            setTotalCards(response.data.total);
            setTotalPages(Math.ceil(response.data.total / cardsPerPage));
        } catch (error) {
            console.error('Error fetching total cards:', error);
        }
    };

    const fetchCards = async (startIdx, endIdx) => {
        if (cards.length > startIdx) {
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
            return;
        }
        try {
            const requestData = { startIdx, endIdx };
            const response = await axios.post('/api/partners', requestData);
            setCards(prevCards => [...prevCards, ...response.data]);
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

    return (
        <>
            {deviceIsDesktop && (
                <div className="listing listing--external">
                    <h2 className="listing__title listing__title--marginBottom">Объекты партнеров</h2>

                    <div className="listing__content">
                        <div className="listing__column listing__column--left">
                            <div className="listing__cards">
                                {cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage).map((card, index) => (
                                    <Card
                                        key={index}
                                        card={card}
                                        modifier="external"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="listing__column listing__column--right">
                            <div className="listing__pagination">
                                <div className="listing__pagination--line">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="listing__pagination--button animate--prev"
                                        aria-label="Предыдущая страница"
                                    >
                                        <IconSprite
                                            selector="PrevIcon"
                                            width="40"
                                            height="40"
                                            fill={currentPage === 1 ? '#676767' : '#F9BC07'}
                                        />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="listing__pagination--button animate--next"
                                        aria-label="Следующая страница"
                                    >
                                        <IconSprite
                                            selector="NextIcon"
                                            width="40"
                                            height="40"
                                            fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                        />
                                    </button>
                                </div>

                                <div className="listing__pagination--info">
                                    Стр. {currentPage}/{totalPages}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PartnerCardList;

