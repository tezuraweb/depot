import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from './Hero';
import MainForm from './MainForm';
import CardList from './CardList';
import { useViewportContext } from '../utils/ViewportContext';

const MainFilter = () => {
    const deviceType = useViewportContext();
    const [cards, setCards] = useState([]);
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
    const [activeType, setActiveType] = useState('');

    const cardsPerPage = deviceType === 'desktop' ? 6 : deviceType === 'laptop' ? 4 : 1;

    useEffect(() => {
        fetchTotalCards();
        fetchCards(0, cardsPerPage, formData);
    }, []);

    useEffect(() => {
        fetchTotalCards();
    }, [formData]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalCards / cardsPerPage));
    }, [cardsPerPage, totalCards]);

    useEffect(() => {
        const startIdx = (currentPage - 1) * cardsPerPage;
        const endIdx = currentPage * cardsPerPage;
        if (cards.length > startIdx && cards.length < endIdx) {
            fetchCards(cards.length, endIdx, formData);
        }
    }, [deviceType]);

    const handleFormSubmit = async (formData) => {
        setFormData(formData);
        setActiveType(formData.type);
        setCards([]);
        fetchCards(0, cardsPerPage, formData);
    };

    const fetchTotalCards = async () => {
        try {
            const response = await axios.get('/api/search/count', { params: formData });
            setTotalCards(response.data.total);
            setTotalPages(Math.ceil(response.data.total / cardsPerPage));
        } catch (error) {
            console.error('Error fetching total cards:', error);
        }
    };

    const fetchCards = async (startIdx, endIdx, formData) => {
        console.log(startIdx, endIdx)
        if (cards.length > startIdx) {
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
            return;
        }
        try {
            const requestData = { ...formData, startIdx, endIdx };
            const response = await axios.post('/api/search', requestData);
            console.log(response.data)
            // setCards(prevCards => {
            //     const newCards = [...prevCards];
            //     response.data.forEach((card, idx) => {
            //         newCards[startIdx + idx] = card;
            //     });
            //     return newCards;
            // });
            setCards(prevCards => [...prevCards, ...response.data]);
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        const startIdx = (page - 1) * cardsPerPage;
        const endIdx = page * cardsPerPage;
        fetchCards(startIdx, endIdx, formData);
    };

    return (
        <>
            <section className="section" id="hero">
                <div className="container">
                    <Hero />
                    {deviceType === 'tablet' || deviceType === 'mobile' ? (
                        <a className="form__link" href="/search">Расширенный поиск</a>
                    ) : (
                        <MainForm onSubmit={handleFormSubmit} formData={formData} setFormData={setFormData} />
                    )}
                </div>
            </section>

            <section className="section" id="main-listing">
                <div className="container">
                    <CardList 
                        cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)} 
                        filters={formData} 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange}
                        modifier="main"
                        totalCards={totalCards}
                        deviceType={deviceType}
                        activeType={activeType}
                        setActiveType={setActiveType}
                    />
                </div>
            </section>
        </>
    );
};

export default MainFilter;

