import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from './Hero';
import MainForm from './MainForm';
import CardList from './CardList';

const MainFilter = () => {
    const [pages, setPages] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        type: '',
        area: '',
        priceFrom: '',
        priceTo: '',
        promotions: false,
        priceDesc: false
    });

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
            price: "80000 руб.",
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
                // setTotalPages(Math.ceil(response.data.total / 6));

                //tmp
                setTotalCards(cards.length);
                setTotalPages(Math.ceil(cards.length / 6));
            } catch (error) {
                console.error('Error fetching total cards:', error);
            }
        };

        fetchTotalCards();
    }, [formData]);

    useEffect(() => {
        fetchCards(formData, 1);
    }, []);

    const handleFormSubmit = async (formData) => {
        setFormData(formData);
        setPages([]);
        fetchCards(formData, 1);
    };

    const fetchCards = async (formData, page) => {
        if (pages[page - 1]) {
            setCurrentPage(page);
            return;
        }
        try {
            // const response = await axios.get('/api/search', {
            //     params: { ...formData, page }
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
            //     setTotalPages(Math.ceil(totalCards / 6));
            // }

            //tmp
            const newPages = [...pages];
            newPages[page - 1] = cards.slice((page - 1) * 6, page * 6);
            setPages(newPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        fetchCards(formData, page);
    };

    return (
        <div>
            <section className="section" id="hero">
                <div className="container">
                    <Hero />
                    <MainForm onSubmit={handleFormSubmit} />
                </div>
            </section>

            <section className="section" id="main-listing">
                <div className="container">
                    <CardList 
                        cards={pages[currentPage - 1] || []} 
                        filters={formData} 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange}
                        modifier="main"
                    />
                </div>
            </section>
        </div>
    );
};

export default MainFilter;
