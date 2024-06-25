import React, { useState } from 'react';
import Card from '../includes/Card';
import Share from '../includes/Share';
import IconSprite from '../includes/IconSprite';

const CardList = ({ cards = [], filters = {}, currentPage = 0, totalPages = 0, onPageChange = null, modifier = '' }) => {
    const [activeCardIndex, setActiveCardIndex] = useState(null);

    const tabs = [
        { label: 'Офисы', value: 'office' },
        { label: 'Производственно-складские', value: 'industrial' },
        { label: 'Торговые', value: 'commercial' },
        { label: 'Участки', value: 'land' }
    ];

    const handleCardClick = (card, index) => {
        if (modifier === 'recommend' || modifier === 'rented') return;
        setActiveCardIndex(index);
    };

    const titleMap = {
        main: 'Свободные помещения',
        search: 'Найдено для вас',
        recommend: 'Мы подобрали помещения, которые максимально похожи по стоимости аренды и площади',
        rented: 'Помещения в аренде'
    };

    const title = titleMap[modifier];
    const showTabs = modifier === 'main';
    const showPagination = modifier !== 'recommend' && modifier !== 'rented';
    const showShareMain = modifier === 'main';
    const showShareSearch = modifier === 'search';
    
    return (
        <div className={`listing ${modifier ? 'listing--' + modifier : ''}`}>
            {title && <h2 className="listing__title">{title}</h2>}
    
            {showTabs && (
                <div className="listing__tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.value}
                            className={`listing__tab ${filters.type === tab.value ? 'active' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}
    
            <div className="listing__content">
                <div className="listing__column listing__column--left">
                    <div className="listing__cards">
                        {cards.map((card, index) => (
                            <Card
                                key={index}
                                card={card}
                                onClick={() => handleCardClick(card, index)}
                                isActive={index === activeCardIndex}
                                modifier={modifier}
                            />
                        ))}
                    </div>
                </div>
    
                {showPagination && (
                    <div className="listing__column listing__column--right">
                        <div className="listing__pagination">
                            <div className="listing__pagination--line">
                                <button
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="listing__pagination--button animate--prev"
                                    aria-label="Предыдущая страница"
                                >
                                    <IconSprite
                                        selector="PrevIcon"
                                        width="40"
                                        height="40"
                                    />
                                </button>
                                <button
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="listing__pagination--button animate--next"
                                    aria-label="Следующая страница"
                                >
                                    <IconSprite
                                        selector="NextIcon"
                                        width="40"
                                        height="40"
                                    />
                                </button>
                            </div>
                            <div className="listing__pagination--info">
                                Стр. {currentPage}/{totalPages}
                            </div>
                        </div>
    
                        {showShareMain && (
                            <Share activeCard={activeCardIndex !== null ? cards[activeCardIndex] : null} modifier='phoneSmall' />
                        )}
                    </div>
                )}
            </div>
    
            {showShareSearch && (
                <Share activeCard={activeCardIndex !== null ? cards[activeCardIndex] : null} modifier='phoneLarge' />
            )}
        </div>
    );
};

export default CardList;