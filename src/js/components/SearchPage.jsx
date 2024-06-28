import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import CardList from './CardList';
import Scheme from './ModalScheme';
import { useViewportContext } from '../utils/ViewportContext';

const SearchPage = () => {
    const deviceType = useViewportContext();
    const [cards, setCards] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        type: '',
        building: '',
        areaFrom: '',
        areaTo: '',
        priceFrom: '',
        priceTo: '',
        storey: '',
        rooms: '',
        ceilingHeight: '',
        promotions: false,
    });

    const cardsPerPage = deviceType === 'desktop' ? 6 : deviceType === 'laptop' ? 4 : 2;

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

    const handlePageChange = (page) => {
        const startIdx = (page - 1) * cardsPerPage;
        const endIdx = page * cardsPerPage;
        fetchCards(startIdx, endIdx, formData);
    };

    return (
        <>
            <section className="section" id="search-block">
                <div className="search container">
                    <div className="search__row">
                        <div className="search__column">
                            <SearchForm onSubmit={handleFormSubmit} />
                        </div>
                        <div className="search__column search__column--flex">
                            <div className="search__map">
                                <Scheme
                                    activeElements={['depot-building-1', 'depot-building-12', 'depot-building-5', 'depot-building-2']}
                                    isModal={true}
                                />
                            </div>
                            <div className="search__info">
                                <div className="search__colors">
                                    <div className="search__title">Карта обозначений</div>
                                    <div className="search__color">
                                        <div className="search__palette search__palette--yellow"></div>
                                        <div className="search__desc">Доступный объект</div>
                                    </div>
                                    <div className="search__color">
                                        <div className="search__palette search__palette--grey"></div>
                                        <div className="search__desc">Недоступный объект</div>
                                    </div>
                                    <div className="search__color">
                                        <div className="search__palette search__palette--red"></div>
                                        <div className="search__desc">Выбранный объект</div>
                                    </div>
                                </div>
                                <div className="search__facilities"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="search-listing">
                <div className="container">
                    <CardList
                        modifier="search"
                        cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)}
                        filters={formData}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        deviceType={deviceType}
                    />
                </div>
            </section>
        </>
    );
};

export default SearchPage;
