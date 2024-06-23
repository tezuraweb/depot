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

    useEffect(() => {
        fetchTotalCards();
        fetchCards(formData, 1);
    }, []);

    useEffect(() => {
        fetchTotalCards();
    }, [formData]);

    const handleFormSubmit = async (formData) => {
        setFormData(formData);
        setPages([]);
        fetchCards(formData, 1);
    };

    const fetchTotalCards = async () => {
        try {
            const response = await axios.get('/api/search/count', { params: formData });
            setTotalCards(response.data.total);
            setTotalPages(Math.ceil(response.data.total / 6));
        } catch (error) {
            console.error('Error fetching total cards:', error);
        }
    };

    const fetchCards = async (formData, page) => {
        if (pages[page - 1]) {
            setCurrentPage(page);
            return;
        }
        try {
            const requestData = { ...formData, page };
            const response = await axios.post('/api/search', requestData);

            if (response.data.length === 0) {
                setPages([]);
                setTotalPages(1);
                setCurrentPage(1);
            } else {
                const newPages = [...pages];
                newPages[page - 1] = response.data;
                setPages(newPages);
                setCurrentPage(page);
                setTotalPages(Math.ceil(totalCards / 6));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePageChange = (page) => {
        fetchCards(formData, page);
    };

    return (
        <>
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
        </>
    );
};

export default MainFilter;
