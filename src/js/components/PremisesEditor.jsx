import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import CardList from './CardList';
import usePhotoManager from '../utils/usePhotoManager';
import LoadingSpinner from '../includes/LoadingSpinner';

const PremisesEditor = () => {
    const { uploadPhoto } = usePhotoManager();
    const [cards, setCards] = useState([]);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [isPromotion, setIsPromotion] = useState(false);
    const [promotionPrice, setPromotionPrice] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [promotionError, setPromotionError] = useState(null);
    const [promotionSuccess, setPromotionSuccess] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [fileSuccess, setFileSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const cardsPerPage = 2;

    useEffect(() => {
        if (cards.length === 0) {
            fetchCards(0, cardsPerPage);
        }
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(totalCards / cardsPerPage));
    }, [cardsPerPage, totalCards]);

    const fetchCards = async (startIdx, endIdx, code = '') => {
        if (cards.length > startIdx) {
            setCurrentPage(Math.floor(startIdx / cardsPerPage) + 1);
            return;
        }
        try {
            const reqData = { startIdx, endIdx };
            if (code !== '') {
                reqData.code = code;
            }
            const response = await axios.post('/api/search', reqData);
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

    const debouncedSearch = useCallback(
        debounce((query) => handleSearchPremises(query), 200),
        []
    );

    useEffect(() => {
        if (searchQuery) {
            debouncedSearch(searchQuery);
        }
    }, [searchQuery, debouncedSearch]);

    const handleSearchPremises = async (query) => {
        if (query) {
            setCards([]);
            setTotalPages(0);
            setCurrentPage(1);
            fetchCards(0, cardsPerPage, query);
        }
    };

    const handlePageChange = (page) => {
        const startIdx = (page - 1) * cardsPerPage;
        const endIdx = page * cardsPerPage;
        setActiveCardIndex(null);
        fetchCards(startIdx, endIdx);
    };

    const setCardIndex = (index) => {
        const globalIndex = (currentPage - 1) * cardsPerPage + index;
        setActiveCardIndex(globalIndex);
        setIsPromotion(cards[globalIndex]?.promotion);
        setPromotionPrice(cards[globalIndex]?.promotion_price);
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files) return;
        setPhotos(files);
    };

    const handleSubmitPromotion = async (e) => {
        e.preventDefault();

        if (promotionPrice <= 0) {
            setPromotionError('Введите цену больше 0!');
            setPromotionSuccess(null);
            return;
        }

        try {
            const id = cards[activeCardIndex].id;
            await axios.post('/api/promotions', { id, promotion: isPromotion, price: promotionPrice });
            setCards(prevCards => {
                const updatedCards = [...prevCards];
                updatedCards[activeCardIndex].promotion = isPromotion;
                return updatedCards;
            });
            setPromotionSuccess('Акция успешно обновлена');
            setPromotionError(null);
        } catch (error) {
            console.error('Error updating promotions:', error);
            setPromotionError('Ошибка при обновлении акции');
            setPromotionSuccess(null);
        }
    };

    const handleSubmitPhotos = async (e) => {
        e.preventDefault();

        try {
            const id = cards[activeCardIndex].id;
            setLoading(true);

            if (photos.length > 0) {
                const uploadPromises = photos.map((file) => uploadPhoto(file, id));

                const results = await Promise.allSettled(uploadPromises);

                const photoUrls = [];
                const errors = [];
                results.forEach(result => {
                    if (result.status === 'fulfilled') {
                        photoUrls.push(result.value);
                    } else {
                        errors.push(result.reason);
                    }
                });

                if (errors.length > 0) {
                    console.error('Errors occurred during photo upload:', errors);
                    setFileError(`При загрузке фотографий возникли ошибки:\n${errors.map(err => err.message).join('\n\n')}`);
                }
                if (photoUrls.length > 0) {
                    setFileSuccess(`Фотографий успешно загружено: ${photoUrls.length}`);
                    setCards(prevCards => {
                        const updatedCards = [...prevCards];
                        updatedCards[activeCardIndex].images.push(...photoUrls);
                        return updatedCards;
                    });
                }
            }
        } catch (error) {
            console.error('Error updating promotions:', error);
            setFileError(`Ошибка при загрузке фотографий: ${error.message}`);
        } finally {
            setTimeout(() => {
                setFileError(null);
                setFileSuccess(null);
            }, 10000);
            setLoading(false);
        }
    };

    const handleDeletePhoto = async (photoUrl) => {
        try {
            const id = cards[activeCardIndex].id;
            await axios.delete('/api/photo', {
                data: {
                    id,
                    photoUrl
                }
            });
            setCards(prevCards => {
                const updatedCards = [...prevCards];
                const updatedImages = updatedCards[activeCardIndex].images.filter(img => img !== photoUrl);
                updatedCards[activeCardIndex].images = updatedImages;
                return updatedCards;
            });
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    return (
        <>
            <form className="form form--small" onSubmit={handleSubmitPromotion}>
                <input
                    type="text"
                    name="searchQuery"
                    placeholder="Поиск по ID помещения"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form__input"
                />
            </form>

            <CardList
                modifier="promotions"
                cards={cards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalCards={totalCards}
                setActiveCardOuter={setCardIndex}
            />

            {activeCardIndex !== null && (
                <>
                    <form className="form form--small" onSubmit={handleSubmitPromotion}>
                        <div className="form__group">
                            <input type="checkbox" name="promotions" id="promotionCheckbox" checked={isPromotion} onChange={(e) => setIsPromotion(e.target.checked)} className="form__checkbox" />
                            <label className="form__label" htmlFor="promotionCheckbox">Акция</label>
                        </div>

                        <input
                            type="text"
                            name="promotionPrice"
                            placeholder="Акционная цена"
                            value={promotionPrice}
                            onChange={(e) => setPromotionPrice(e.target.value)}
                            className="form__input"
                            required={isPromotion}
                        />

                        <button type="submit" className="form__button button">Сохранить</button>
                        {promotionError && <div className="form__message form__message--red">{promotionError}</div>}
                        {promotionSuccess && <div className="form__message form__message--green">{promotionSuccess}</div>}
                    </form>

                    <form className="form form--small" onSubmit={handleSubmitPhotos}>
                        <div className="form__group">
                            <label className="form__label">Изменить фотографию</label>
                            <input
                                className="form__input form__input--black"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotoChange(e)}
                            />
                        </div>

                        <button type="submit" className="form__button button">Сохранить</button>
                        {fileError && <div className="form__message form__message--red">{fileError}</div>}
                        {fileSuccess && <div className="form__message form__message--green">{fileSuccess}</div>}
                    </form>

                    {loading && <LoadingSpinner />}

                    <div className="editor__photos">
                        {cards[activeCardIndex].images && cards[activeCardIndex].images.map((img, index) => (
                            <div className="card__carousel" key={index}>
                                <div className="card__pic">
                                    <img
                                        src={img}
                                        alt="Property"
                                        className="card__pic--img"
                                    />
                                </div>
                                <button className="form__button button button--red" onClick={() => handleDeletePhoto(img)}>Удалить</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default PremisesEditor;
