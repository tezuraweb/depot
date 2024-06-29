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

    const cardsPerPage = deviceType === 'desktop' ? 6 : deviceType === 'laptop' ? 4 : 1;

    useEffect(() => {
        fetchTotalCards();
    }, []);

    useEffect(() => {
        if (cards.length == 0) {
            fetchCards(0, cardsPerPage, formData);
        }
    }, [cards]);

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

    const handleFormSubmit = async (data) => {
        setFormData(data);
        setActiveType(data.type);
        setCards([]);
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

    const fetchCards = async (startIdx, endIdx, data) => {
        if (cards.length > startIdx) {
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
            return;
        }
        try {
            const requestData = { ...data, startIdx, endIdx };
            const response = await axios.post('/api/search', requestData);
            setCards(prevCards => [...prevCards, ...response.data]);
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const setActiveType = (tabType) => {
        setFormData({
            ...formData,
            type: tabType,
        });
        setCards([]);
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
                    <Hero showSearchIcon={deviceType === 'mobile' ? true : false}/>
                    <MainForm
                        onSubmit={handleFormSubmit}
                        formData={formData}
                        setFormData={setFormData}
                        showSearchIcon={deviceType === 'mobile' ? true : false}
                    />
                </div>
            </section>

            <section className="section" id="main-listing">
                <div className="container">
                    <CardList
                        modifier="main"
                        cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)} 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange}
                        totalCards={totalCards}
                        activeTab={formData.type}
                        setActiveTab={setActiveType}
                    />
                </div>
            </section>
        </>
    );
};

export default MainFilter;

