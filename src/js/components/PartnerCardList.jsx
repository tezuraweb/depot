import React, { useState, useEffect } from 'react';
import Card from '../includes/Card';
import IconSprite from '../includes/IconSprite';
import PartnerLinks from './PartnerLinks';

const PartnerCardList = () => {
    const [pages, setPages] = useState([]);
    const [activeCards, setActiveCards] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const cards = [
        {
            id: 1,
            promotion: true,
            location: "Центр города",
            article: "A123",
            area: 100,
            floor: 3,
            price: "50000 руб.",
            images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
            type: "office"
        },
        {
            id: 2,
            promotion: false,
            location: "Промышленная зона",
            article: "B456",
            area: 500,
            floor: 1,
            price: "150000 руб.",
            images: ['/img/pics/ft.png'],
            type: "industrial"
        },
        {
            id: 3,
            promotion: true,
            location: "Торговый центр",
            article: "C789",
            area: 200,
            floor: 2,
            images: ['/img/pics/ft.png'],
            type: "commercial"
        },
        {
            id: 4,
            promotion: false,
            location: "Пригород",
            article: "D012",
            area: 1000,
            floor: 0,
            price: "100000 руб.",
            images: ['/img/pics/ft.png'],
            type: "land"
        },
        {
            id: 5,
            promotion: true,
            location: "Центр города",
            article: "E345",
            area: 120,
            floor: 4,
            price: "60000 руб.",
            images: ['/img/pics/ft.png'],
            type: "office"
        },
        {
            id: 6,
            promotion: false,
            location: "Индустриальный парк",
            article: "F678",
            area: 800,
            floor: 1,
            price: "200000 руб.",
            images: ['/img/pics/ft.png'],
            type: "industrial"
        },
        {
            id: 7,
            promotion: true,
            location: "Жопа",
            article: "A123",
            area: 100,
            floor: 3,
            price: "50000 руб.",
            images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
            type: "office"
        },
        {
            id: 8,
            promotion: false,
            location: "Жопа",
            article: "B456",
            area: 500,
            floor: 1,
            price: "150000 руб.",
            images: ['/img/pics/ft.png'],
            type: "industrial"
        },
        {
            id: 9,
            promotion: true,
            location: "Пизда",
            article: "C789",
            area: 200,
            floor: 2,
            price: "80000 руб.",
            images: ['/img/pics/ft.png'],
            type: "commercial"
        },
        {
            id: 10,
            promotion: false,
            location: "Дно",
            article: "D012",
            area: 1000,
            floor: 0,
            price: "100000 руб.",
            images: ['/img/pics/ft.png'],
            type: "land"
        },
        {
            id: 11,
            promotion: true,
            location: "Дыра",
            article: "E345",
            area: 120,
            floor: 4,
            price: "60000 руб.",
            images: ['/img/pics/ft.png'],
            type: "office"
        },
        {
            id: 12,
            promotion: false,
            location: "Хрущобы",
            article: "F678",
            area: 800,
            floor: 1,
            price: "200000 руб.",
            images: ['/img/pics/ft.png'],
            type: "industrial"
        },
        {
            id: 9,
            promotion: true,
            location: "Пизда",
            article: "C789",
            area: 200,
            floor: 2,
            price: "80000 руб.",
            images: ['/img/pics/ft.png'],
            type: "commercial"
        },
        {
            id: 10,
            promotion: false,
            location: "Дно",
            article: "D012",
            area: 1000,
            floor: 0,
            price: "100000 руб.",
            images: ['/img/pics/ft.png'],
            type: "land"
        },
    ];

    useEffect(() => {
        const fetchTotalCards = async () => {
            try {
                // const response = await axios.get('/api/search/count', { params: formData });
                // setTotalCards(response.data.total);
                // setTotalPages(Math.ceil(response.data.total / 3));

                //tmp
                setTotalCards(cards.length);
                setTotalPages(Math.ceil(cards.length / 3));
            } catch (error) {
                console.error('Error fetching total cards:', error);
            }
        };

        fetchTotalCards();
    }, []);

    useEffect(() => {
        fetchCards(1);
    }, []);


    const fetchCards = async (page) => {
        if (pages[page - 1]) {
            setCurrentPage(page);
            setActiveCards(pages[page - 1]);
            return;
        }
        try {
            // const response = await axios.get('/api/partners', {
            //     params: { page }
            // });
            // if (response.data.length === 0) {
            //     setPages([]);
            //     setTotalPages(1);
            //     setCurrentPage(1);
            // } else {
            //     const newPages = [...pages];
            //     newPages[page - 1] = response.data;
            //     setPages(newPages);
            //     setCurrentPage(page);
            //     setActiveCards(newPages[page - 1]);
            //     setTotalPages(Math.ceil(totalCards / 3));
            // }

            //tmp
            const newPages = [...pages];
            newPages[page - 1] = cards.slice((page - 1) * 3, page * 3);
            setPages(newPages);
            setCurrentPage(page);
            setActiveCards(newPages[page - 1]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        fetchCards(page);
    };

    return (
        <div className="listing">
            <h2 className="listing__title listing__title--marginBottom">Объекты партнеров</h2>

            <div className="listing__content">
                <div className="listing__column listing__column--left">
                    <div className="listing__cards">
                        {activeCards.map((card, index) => (
                            <Card
                                key={index}
                                card={card}
                                isExternal={true}
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
                                className="listing__pagination--button"
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
                                className="listing__pagination--button"
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

