import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../includes/Card';
import IconSprite from '../includes/IconSprite';
import PartnerLinks from './PartnerLinks';

const PartnerCardList = () => {
    const [pages, setPages] = useState([]);
    const [activeCards, setActiveCards] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTotalCards();
        fetchCards(1);
    }, []);

    const fetchTotalCards = async () => {
        try {
            const response = await axios.get('/api/partners/count');
            setTotalCards(response.data.total);
            setTotalPages(Math.ceil(response.data.total / 3));
        } catch (error) {
            console.error('Error fetching total cards:', error);
        }
    };

    const fetchCards = async (page) => {
        if (pages[page - 1]) {
            setCurrentPage(page);
            setActiveCards(pages[page - 1]);
            return;
        }
        try {
            const response = await axios.post('/api/partners', { page });
            if (response.data.length === 0) {
                setPages([]);
                setTotalPages(1);
                setCurrentPage(1);
            } else {
                const newPages = [...pages];
                newPages[page - 1] = response.data;
                setPages(newPages);
                setCurrentPage(page);
                setActiveCards(newPages[page - 1]);
                setTotalPages(Math.ceil(totalCards / 3));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        fetchCards(page);
    };

    return (
        <div className="listing listing--external">
            <h2 className="listing__title listing__title--marginBottom">Объекты партнеров</h2>

            <div className="listing__content">
                <div className="listing__column listing__column--left">
                    <div className="listing__cards">
                        {activeCards.map((card, index) => (
                            <Card
                                key={index}
                                card={card}
                                modifier="external"
                            />
                        ))}
                    </div>

                    <PartnerLinks />
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
    );
};

export default PartnerCardList;

