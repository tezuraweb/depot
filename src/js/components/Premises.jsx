import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Scheme from './StaticScheme';
import CardList from './CardList';
import ContactForm from './ContactForm';
import Share from '../includes/Share';
import IconSprite from '../includes/IconSprite';
import LoadingSpinner from '../includes/LoadingSpinner';
import { useViewportContext } from '../utils/ViewportContext';

const Premises = ({ siteName }) => {
    const deviceType = useViewportContext();
    const [state, setState] = useState({
        premises: null,
        recommendations: [],
        loading: true,
        error: null,
        message: '',
        currentImageIndex: 0,
        showInfo: true
    });

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                const [premisesResponse, recommendationsResponse] = await Promise.all([
                    axios.get(`/api/premises/${id}`),
                    axios.get(`/api/recommendations/${id}`)
                ]);

                console.log(premisesResponse.data)

                setState(prev => ({
                    ...prev,
                    premises: premisesResponse.data,
                    recommendations: recommendationsResponse.data,
                    loading: false,
                    showInfo: premisesResponse.data?.type !== 'Земельный участок'
                }));
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    error: 'Помещение не найдено',
                    loading: false
                }));
            }
        };

        fetchData();
    }, [id]);

    const handlePrint = () => window.print();

    const handleShare = async () => {
        const url = window.location.href;
        const title = `Помещение: ${state.premises?.room}`;

        try {
            if (navigator.share) {
                await navigator.share({ title, url });
            } else {
                await navigator.clipboard.writeText(url);
                setState(prev => ({ ...prev, message: 'Ссылка скопирована в буфер обмена' }));
            }
        } catch (error) {
            setState(prev => ({ ...prev, message: 'Ошибка' }));
        }

        setTimeout(() => {
            setState(prev => ({ ...prev, message: '' }));
        }, 5000);
    };

    const handleImageNavigation = (direction) => {
        setState(prev => ({
            ...prev,
            currentImageIndex: (prev.currentImageIndex + direction + (prev.premises?.images?.length || 0)) %
                (prev.premises?.images?.length || 1)
        }));
    };

    if (state.loading) return <LoadingSpinner />;
    if (state.error) return <div className="premises__error">{state.error}</div>;
    if (!state.premises) return <div className="premises__error">Помещение не найдено</div>;

    const showFullLink = deviceType === 'desktop' || deviceType === 'laptop';
    const showPrinter = deviceType === 'desktop' || deviceType === 'laptop';
    const showMaps = deviceType !== 'mobile';

    const companyAddresses = {
        depo: 'Ижевск, Буммашевская, 5',
        gagarinsky: 'Ижевск, Гагарина, 17',
        yujnaya: 'Ижевск, Маяковского, 43'
    };

    return (
        <>
            <section className="section" id="premises-data">
                <div className="premises container">
                    <div className="premises__links">
                        <a className="premises__back" href="/search">
                            {`Назад ${showFullLink ? 'к подбору помещений' : ''}`}
                        </a>
                        <div className="premises__buttons">
                            {showPrinter && (
                                <button className="premises__button button button--icon" onClick={handlePrint}>
                                    <IconSprite selector="PrinterIcon" width="30" height="30" />
                                </button>
                            )}
                            <button className="premises__button button button--icon" onClick={handleShare}>
                                <IconSprite selector="ShareIcon" width="26" height="28" />
                            </button>
                            {state.message && <div className="premises__message">{state.message}</div>}
                            <ContactForm modal={true} buttonView="icon" />
                        </div>
                    </div>

                    <div className="premises__wrapper">
                        <div className="premises__header">
                            {state.showInfo && state.premises.key_liter && (
                                <div className="premises__header--block">
                                    <div className="premises__heading premises__heading--uppercase">Литер</div>
                                    <div className="premises__heading premises__heading--large">
                                        {state.premises.key_liter}
                                    </div>
                                </div>
                            )}
                            <div className="premises__header--block">
                                <div className="premises__heading premises__heading--uppercase">
                                    {state.premises.type}
                                </div>
                                <div className="premises__heading premises__heading--large">
                                    {state.premises.room}
                                </div>
                            </div>
                        </div>

                        <div className="premises__row">
                            <div className="premises__column">
                                <h2 className="premises__title">Характеристики помещения</h2>
                                <div className="premises__grid premises__grid--three">
                                    <div className="premises__cell">
                                        <IconSprite selector="AreaIcon" width="19" height="19" />
                                    </div>
                                    <div className="premises__cell">Площадь:</div>
                                    <div className="premises__cell premises__cell--bold">
                                        {state.premises.area} м²
                                    </div>

                                    {state.showInfo && (
                                        <>
                                            <div className="premises__cell">
                                                <IconSprite selector="StoreyIcon" width="19" height="19" />
                                            </div>
                                            <div className="premises__cell">Этаж:</div>
                                            <div className="premises__cell premises__cell--bold">
                                                {state.premises.floor}
                                            </div>

                                            <div className="premises__cell">
                                                <IconSprite selector="CeilingHeight" width="19" height="19" />
                                            </div>
                                            <div className="premises__cell">Высота потолка:</div>
                                            <div className="premises__cell premises__cell--bold">
                                                {state.premises.ceiling} м
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="premises__label">Стоимость аренды:</div>
                                <div className="premises__grid premises__grid--two">
                                    <div className="premises__cell">
                                        <IconSprite selector="PriceIcon" width="19" height="19" />
                                    </div>
                                    <div className="premises__cell premises__cell--bold">
                                        {Math.round(state.premises.cost)} ₽ / м²
                                    </div>
                                    <div className="premises__cell">
                                        <IconSprite selector="PriceIcon" width="19" height="19" />
                                    </div>
                                    <div className="premises__cell premises__cell--bold">
                                        {state?.premises?.promotion_price ? (
                                            <>
                                                <span className="premises__cell--green">{Math.round(state.premises.promotion_price)} ₽ / мес.</span>{' '}
                                                <span className="premises__cell--strikethrough">{Math.round(state.premises.cost * state.premises.area)} ₽ / мес.</span>
                                            </>
                                        ) : (
                                            `${Math.round(state.premises.cost * state.premises.area)} ₽ / мес.`
                                        )}
                                    </div>
                                </div>
                                <div className="premises__label">без НДС</div>
                            </div>

                            <div className="premises__column">
                                {state.premises.images?.length > 0 && (
                                    <>
                                        <h2 className="premises__title">Фото помещения</h2>
                                        <div className="premises__carousel card__carousel">
                                            <div className="card__pic">
                                                <img
                                                    src={state.premises.images[state.currentImageIndex]}
                                                    alt="Property"
                                                    className="card__pic--img"
                                                />
                                            </div>
                                            {state.premises.images.length > 1 && (
                                                <>
                                                    <button
                                                        className="card__nav card__nav--prev"
                                                        onClick={() => handleImageNavigation(-1)}
                                                    >
                                                        {'<'}
                                                    </button>
                                                    <button
                                                        className="card__nav card__nav--next"
                                                        onClick={() => handleImageNavigation(1)}
                                                    >
                                                        {'>'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <Share activeCard={state.premises} modifier="phoneLarge" />
                    </div>
                </div>
            </section>

            <section className="section" id="premises-maps">
                <div className="premises container">
                    <div className="premises__wrapper">
                        {showMaps && (
                            <>
                                <div className="premises__location">
                                    <h2 className="premises__title">Расположение</h2>
                                    <a className="premises__title" href="/">
                                        {companyAddresses[siteName] || ''}
                                    </a>
                                </div>

                                <div className="premises__scheme">
                                    <Scheme
                                        activeElement={state.premises}
                                        siteName={siteName}
                                    />
                                </div>
                            </>
                        )}

                        <div className="premises__info">
                            <h2 className="premises__title">Общая информация</h2>
                            <div className="premises__text">{state.premises.text}</div>
                            <div className="premises__points">
                                <div className="premises__point">
                                    <div className="button button--icon">
                                        <IconSprite selector="HoursIcon" width="26" height="26" />
                                    </div>
                                    <div className="premises__point--text">Круглосуточный доступ 24/7</div>
                                </div>
                                <div className="premises__point">
                                    <div className="button button--icon">
                                        <IconSprite selector="ParkingIcon" width="31" height="30" />
                                    </div>
                                    <div className="premises__point--text">Вместительный паркинг</div>
                                </div>
                                <div className="premises__point">
                                    <div className="button button--icon">
                                        <IconSprite selector="CanteenIcon" width="27" height="26" />
                                    </div>
                                    <div className="premises__point--text">
                                        Столовая на территории комплекса
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {state.recommendations?.length > 0 && (
                <section className="section" id="premises-listing">
                    <div className="container">
                        <CardList cards={state.recommendations} modifier="recommend" />
                    </div>
                </section>
            )}
        </>
    );
};

export default Premises;