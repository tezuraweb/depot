import React, { useState } from 'react';
import IconSprite from './IconSprite';

const Card = ({ card, onClick = null, isActive, modifier = '' }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const types = {
        office: 'Офис',
        industrial: 'Производственно-складское',
        commercial: 'Торговое',
        land: 'Участок',
    };

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

    const isExternal = modifier === 'external';
    const showPromotion = card.promotion && modifier !== 'rented';
    const showType = isExternal && card.type;
    const showLocation = isExternal ? card.location : card.location && !isExternal;
    const showArea = card.area !== undefined;
    const showStorey = !isExternal && card.floor !== undefined;
    const showPrice = card.price !== undefined || (isExternal && !card.price);
    const showDetailsButton = !isExternal && modifier !== 'rented';
    const showRentedUntil = modifier === 'rented' && card.rentedUntil;
    const showExternalLink = isExternal;

    return (
        <div className={`card ${modifier ? 'card--' + modifier : ''} ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <div className="card__wrapper">
                <div className="card__carousel">
                    <div className="card__pic">
                        <img
                            src={card.images[currentImageIndex]}
                            alt="Property"
                            className="card__pic--img"
                        />
                        {showPromotion && <div className="card__promotion">Акция</div>}
                    </div>
                    {card.images.length > 1 && <button className="card__nav card__nav--prev" onClick={handlePrevImage}>{'<'}</button>}
                    {card.images.length > 1 && <button className="card__nav card__nav--next" onClick={handleNextImage}>{'>'}</button>}
                </div>
                <div className="card__info">
                    {showType && (
                        <div className="card__type">{types[card.type]}</div>
                    )}

                    <div className="card__location">
                        {showLocation && (
                            <>
                                {isExternal ? card.location : `Место: `}
                                {!isExternal && <span className="card__value">{card.location}</span>}
                            </>
                        )}
                    </div>

                    <div className="card__columns">
                        <div className={`card__details ${isExternal ? 'card__details--flex' : ''}`}>
                            {showArea && (
                                <div className="card__detail">
                                    <span className="card__icon">
                                        <IconSprite
                                            selector="AreaIcon"
                                            width="19"
                                            height="19"
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
                                            width="19"
                                            height="19"
                                        />
                                    </span>
                                    <span className="card__value">{card.floor} этаж</span>
                                </div>
                            )}

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
                                        {isExternal && !card.price ? 'По запросу' : `${card.price} / мес.`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {showDetailsButton && (
                            <a href={`/premises/${card.id}`} className="card__button button">Подробнее</a>
                        )}
                    </div>

                    {showRentedUntil && (
                        <div className="card__rented">
                            <div className="card__subtitle">Арендовано до:</div>
                            <div className="card__value">{card.rentedUntil}</div>
                        </div>
                    )}
                </div>

                {showExternalLink && (
                    <a href={`saitprtnera`} className="card__link button">Перейти на сайт партнера</a>
                )}
            </div>
        </div>
    );
};

export default Card;
