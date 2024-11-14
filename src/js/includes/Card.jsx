import React, { useState } from 'react';
import IconSprite from './IconSprite';

const Card = ({ card, onClick = null, isActive, modifier = '' }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % card.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + card.images.length) % card.images.length);
    };

    const handleClick = (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && onClick !== null) {
            onClick(card);
        }
    };

    const getExtarnalLink = (org) => {
        if (org === 'База Южная ООО') {
            return 'https://yuzhka.ru';
        } else if (org === 'Строительная База "Южная" ООО') {
            return 'https://bazayug.ru';
        } else if (org === 'ГАГАРИНСКИЙ ПКЦ ООО') {
            return 'https://gagarinski.rent';
        } else if (org === 'ДЕПО АО') {
            return 'https://depoarenda.ru';
        }
        return '';
    }

    const isExternal = modifier === 'external';
    const isPromotion = modifier === 'promotions';
    const hideInfo = card.type === 'Земельный участок';
    const showPromotion = card.promotion && modifier !== 'rented';
    const showType = card.type !== undefined;
    const showLocation = card.key_liter !== undefined && !isExternal && !hideInfo;
    const showArea = card.area !== undefined;
    const showStorey = !isExternal && card.floor !== undefined && !hideInfo;
    const showPrice = card.cost !== undefined || isExternal;
    const showDetailsButton = !isExternal && (modifier !== 'rented' && modifier !== 'promotions');
    const showRentedUntil = modifier === 'rented' && card.date;
    const showPics = card.images !== undefined && card.images?.length > 0;
    const showExternalLink = isExternal;
    const showPromotionPrice = card.promotion && card.promotion_price > 0;
    const showRoomsAmount = card?.amount > 0 && !hideInfo;
    const coverPlaceholder = card.type == 'Офис' ? '/img/pics/officePlaceholder.webp' : '/img/pics/warehousePlaceholder.webp';

    return (
        <div className={`card ${modifier ? 'card--' + modifier : ''} ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <div className="card__wrapper">
                <div className="card__carousel">
                    <div className="card__pic">
                        {showPics ? (
                            <img
                                src={isExternal ? `${getExtarnalLink(card.organization)}/${card.images[currentImageIndex]}` : card.images[currentImageIndex]}
                                alt="Property"
                                className="card__pic--img"
                            />
                        ) : (
                            <img
                                src={coverPlaceholder}
                                alt="Property"
                                className="card__pic--img"
                            />
                        )}

                        {showPromotion && <div className="card__promotion">Акция</div>}
                    </div>
                    {(showPics && card.images.length > 1) && <button className="card__nav card__nav--prev" onClick={handlePrevImage}>{'<'}</button>}
                    {(showPics && card.images.length > 1) && <button className="card__nav card__nav--next" onClick={handleNextImage}>{'>'}</button>}
                </div>
                <div className="card__info">
                    {showType && (
                        <div className="card__type">{card.type}</div>
                    )}

                    {showLocation && (
                        <div className="card__location">
                            Литер: <span className="card__value">{card.key_liter}</span>
                        </div>
                    )}

                    <div className="card__rows">
                        <div className={`card__row card__details ${isExternal ? 'card__details--flex' : ''}`}>
                            {showArea && (
                                <div className="card__detail">
                                    <span className="card__icon">
                                        <IconSprite
                                            selector="AreaIcon"
                                            width="20"
                                            height="20"
                                        />
                                    </span>
                                    <span className="card__value">{card.area} м²</span>
                                </div>
                            )}

                            {showStorey && (
                                <div className="card__detail">
                                    <span className="card__icon">
                                        <IconSprite
                                            selector="StoreyIcon"
                                            width="20"
                                            height="20"
                                        />
                                    </span>
                                    <span className="card__value">{card.floor} этаж</span>
                                </div>
                            )}

                            {showRoomsAmount && (
                                <div className="card__detail">
                                    <span className="card__icon">
                                        <IconSprite
                                            selector="RoomsAmountIcon"
                                            width="20"
                                            height="20"
                                        />
                                    </span>
                                    <span className="card__value">{card.amount}{card.amount == 1 ? ' комната' : ([2, 3, 4].includes(card.amount) ? ' комнаты': ' комнат')}</span>
                                </div>
                            )}
                        </div>

                        <div className="card__row">
                            {showPrice && (
                                <div className="card__detail">
                                    <span className="card__icon">
                                        <IconSprite
                                            selector="PriceIcon"
                                            width="19"
                                            height="17"
                                        />
                                    </span>
                                    <span className="card__value">
                                        {isExternal && !card.cost ? (
                                            'По запросу'
                                        ) : showPromotionPrice ? (
                                            isPromotion ? (
                                                <>
                                                    <span className="card__value--green">{`${Math.round(card.promotion_price)}₽ / мес.`}</span>
                                                    <span>{` (${Math.round(card.cost * card.area)}₽ / мес.)`}</span>
                                                </>
                                            ) : (
                                                <span className="card__value--red">{`${Math.round(card.promotion_price)}₽ / мес.`}</span>
                                            )
                                        ) : (
                                            `${Math.round(card.cost * card.area)}₽ / мес.`
                                        )}
                                    </span>
                                </div>
                            )}

                            {showDetailsButton && (
                                <a href={`/premises/${card.id}`} className="card__button button animate--pulse">Подробнее</a>
                            )}
                        </div>
                    </div>

                    {showRentedUntil && (
                        <div className="card__rented">
                            <div className="card__subtitle">Арендовано до:</div>
                            <div className="card__value">{card.date}</div>
                        </div>
                    )}
                </div>

                {showExternalLink && (
                    <a href={`${getExtarnalLink(card.organization)}/premises/${card.id}`} className="card__link button" target="_blank">Перейти на сайт партнера</a>
                )}
            </div>
        </div>
    );
};

export default Card;
