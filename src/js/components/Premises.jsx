import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Scheme from './StaticScheme';
import CardList from './CardList';
import ContactForm from './ContactForm';
import Share from '../includes/Share';
import IconSprite from '../includes/IconSprite';
import LoadingSpinner from '../includes/LoadingSpinner';

const Premises = () => {
    const [premisesId, setPremisesId] = useState(null);
    const [premisesData, setPremisesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const id = window.premisesId;
        if (id) {
            setPremisesId(id);

            axios.get(`/api/premises/${id}`)
                .then(response => {
                    setPremisesData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (premisesId) {
            axios.get(`/api/recommendations/${premisesId}`)
                .then(response => {
                    setRecommendations(response.data);
                })
                .catch(error => {
                    setRecommendations([]);
                });
        } else {
            setLoading(false);
        }
    }, [premisesId]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = `Premises ID: ${premisesId}`;

        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch (error) {
                setMessage('Error sharing: ' + error.message);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setMessage('Link copied to clipboard!');
            } catch (error) {
                setMessage('Failed to copy the link: ' + error.message);
            }
        }
    };

    const handleNextImage = () => {
        // setLoading(true);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % premisesData.images.length);
    };

    const handlePrevImage = () => {
        // setLoading(true);
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + premisesData.images.length) % premisesData.images.length);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!premisesData) {
        return <div>No data available</div>;
    }

    return (
        <>
            <section class="section" id="premises-data">
                <div class="premises container">
                    <a class="premises__back" href="/search">Назад к подбору помещений</a>

                    <div className="premises__wrapper">
                        <div className="premises__header">
                            <div className="premises__heading premises__heading--uppercase">Литер</div>
                            <div className="premises__heading premises__heading--large">{premisesData.liter}</div>
                            <div className="premises__heading premises__heading--uppercase">{premisesData.type}</div>
                            <div className="premises__heading premises__heading--large">{premisesData.name}</div>
                            <div className="premises__buttons">
                                <button className="premises__button button button--icon" onClick={handlePrint}>
                                    <IconSprite
                                        selector="PrinterIcon"
                                        width="30"
                                        height="30"
                                    />
                                </button>
                                <button className="premises__button button button--icon" onClick={handleShare}>
                                    <IconSprite
                                        selector="ShareIcon"
                                        width="26"
                                        height="28"
                                    />
                                </button>
                                {message && <div className="premises__message">{message}</div>}
                                <ContactForm modal={true} buttonView="icon" />
                            </div>
                        </div>

                        <div className="premises__row">
                            <div className="premises__column">
                                <h2 className="premises__title">Характеристики помещения</h2>
                                <div className="premises__grid premises__grid--three">
                                    <div className="premises__cell">
                                        <IconSprite
                                            selector="AreaIcon"
                                            width="19"
                                            height="19"
                                        />
                                    </div>
                                    <div className="premises__cell">Площадь:</div>
                                    <div className="premises__cell premises__cell--bold">{premisesData.area} м²</div>
                                    <div className="premises__cell">
                                        <IconSprite
                                            selector="StoreyIcon"
                                            width="19"
                                            height="19"
                                        />
                                    </div>
                                    <div className="premises__cell">Этаж:</div>
                                    <div className="premises__cell premises__cell--bold">{premisesData.floor}</div>
                                    <div className="premises__cell">
                                        <IconSprite
                                            selector="CeilingHeight"
                                            width="19"
                                            height="19"
                                        />
                                    </div>
                                    <div className="premises__cell">Высота потолка:</div>
                                    <div className="premises__cell premises__cell--bold">{premisesData.ceiling} м</div>
                                </div>

                                <div className="premises__label">Стоимость аренды:</div>
                                <div className="premises__grid premises__grid--two">
                                    <div className="premises__cell">
                                        <IconSprite
                                            selector="PriceIcon"
                                            width="19"
                                            height="19"
                                        />
                                    </div>
                                    <div className="premises__cell premises__cell--bold">{Math.round(premisesData.cost / premisesData.area)} ₽ / м²</div>
                                    <div className="premises__cell">
                                        <IconSprite
                                            selector="PriceIcon"
                                            width="19"
                                            height="19"
                                        />
                                    </div>
                                    <div className="premises__cell premises__cell--bold">{premisesData.cost} ₽ / мес.</div>
                                </div>
                                <div className="premises__label">без НДС</div>
                            </div>

                            <div className="premises__column">
                                {(premisesData.images && premisesData.images.length > 0) && (
                                    <>
                                        <h2 className="premises__title">Фото помещения</h2>
                                        <div className="card__carousel">
                                            <div className="card__pic">
                                                {/* {loading && <div className="card__pic--placeholder">Загрузка...</div>} */}
                                                <img
                                                    src={premisesData.images[currentImageIndex]}
                                                    alt="Property"
                                                    className="card__pic--img"
                                                // onLoad={() => setLoading(false)}
                                                // style={{ display: loading ? 'none' : 'block' }}
                                                />
                                            </div>
                                            {premisesData.images.length > 1 && <button className="card__nav card__nav--prev" onClick={handlePrevImage}>{'<'}</button>}
                                            {premisesData.images.length > 1 && <button className="card__nav card__nav--next" onClick={handleNextImage}>{'>'}</button>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <Share activeCard={premisesData} modifier='phoneLarge' />
                    </div>
                </div>
            </section>

            <section className="section" id="premises-maps">
                <div className="premises container">
                    <div className="premises__wrapper">
                        <div className="premises__location">
                            <h2 className="premises__title">Расположение</h2>
                            <a className="premises__title" href="/">Ижевск, Буммашевская, 5</a>
                        </div>

                        <div className="premises__scheme">
                            <Scheme
                                activeElement={premisesData.building_id}
                                floor={premisesData.floor}
                            />
                        </div>

                        <h2 className="premises__title">Общая информация</h2>
                        <div className="premises__info">
                            <div className="premises__text">{premisesData.text}</div>
                            <div className="premises__points">
                                <div className="premises__point">
                                    <div className="button button--icon">
                                        <IconSprite
                                            selector="HoursIcon"
                                            width="26"
                                            height="26"
                                        />
                                    </div>
                                    <div className="premises__point--text">Круглосуточный доступ 24/7</div>
                                </div>
                                <div className="premises__point">
                                    <div className="button button--icon">
                                        <IconSprite
                                            selector="ParkingIcon"
                                            width="31"
                                            height="30"
                                        />
                                    </div>
                                    <div className="premises__point--text">Вместительный паркинг</div>
                                </div>
                                <div className="premises__point">
                                    <div className="button button--icon">
                                        <IconSprite
                                            selector="CanteenIcon"
                                            width="27"
                                            height="26"
                                        />
                                    </div>
                                    <div className="premises__point--text">Столовая на территории комплекса</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="premises-listing">
                <div className="container">
                    <CardList
                        cards={recommendations}
                        modifier="recommend"
                    />
                </div>
            </section>
        </>
    );
};

export default Premises;