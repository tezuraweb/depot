import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import CardList from './CardList';
import Scheme from './ModalScheme';

const SearchPage = () => {
    const [pages, setPages] = useState([]);
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
                        cards={pages[currentPage - 1] || []}
                        filters={formData}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        modifier="search"
                    />
                </div>
            </section>
        </>
    );
};

export default SearchPage;
