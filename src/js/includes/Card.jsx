import React, { useState } from 'react';

import IconSprite from './IconSprite';

const Card = ({ card, onClick, isActive, isExternal=false, modifier='' }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const types = {
        office: 'Офис',
        industrial: 'Производственно-складское',
        commercial: 'Торговое',
        land: 'Участок',
    };

    const handleNextImage = () => {
        // setLoading(true);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % card.images.length);
    };

    const handlePrevImage = () => {
        // setLoading(true);
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + card.images.length) % card.images.length);
    };

    const handleClick = (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
            onClick(card);
        }
    };

    return (
        <div className={`card ${modifier ? 'card--' + modifier : ''} ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <div className="card__wrapper">
                <div className="card__carousel">
                    <div className="card__pic">
                        {/* {loading && <div className="card__pic--placeholder">Загрузка...</div>} */}
                        <img
                            src={card.images[currentImageIndex]}
                            alt="Property"
                            className="card__pic--img"
                        // onLoad={() => setLoading(false)}
                        // style={{ display: loading ? 'none' : 'block' }}
                        />
                        {card.promotion && <div className="card__promotion">Акция</div>}
                    </div>
                    {card.images.length > 1 && <button className="card__nav card__nav--prev" onClick={handlePrevImage}>{'<'}</button>}
                    {card.images.length > 1 && <button className="card__nav card__nav--next" onClick={handleNextImage}>{'>'}</button>}
                </div>
                <div className="card__info">
                    {isExternal && (
                        <div className="card__type">{types[card.type]}</div>
                    )}

                    <div className="card__location">
                        {isExternal ? (
                            card.location
                        ) : (
                            <>
                                Место: <span className="card__value">{card.location}</span>
                            </>
                        )}
                    </div>

                    <div className="card__columns">
                        <div className={`card__details ${isExternal ? 'card__details--flex' : ''}`}>
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

                            {!isExternal && (
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

                            <div className="card__detail">
                                <span className="card__icon">
                                    <IconSprite
                                        selector="PriceIcon"
                                        width="19"
                                        height="17"
                                    />
                                </span>
                                <span className="card__value">
                                    {(isExternal && !card.price) ? 'По запросу' : `${card.price} / мес.`}
                                </span>
                            </div>
                        </div>

                        {!isExternal && (
                            <a href={`/property/${card.id}`} className="card__button button">Подробнее</a>
                        )}
                    </div>
                </div>

                {isExternal && (
                    <a href={`/property/${card.id}`} className="card__link button">Перейти на сайт партнера</a>
                )}
            </div>
        </div>
    );
};

export default Card;
