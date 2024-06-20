import React, { useState } from 'react';
import Card from '../includes/Card';
import IconSprite from '../includes/IconSprite';

const CardList = ({ cards, filters, currentPage, totalPages, onPageChange, modifier = '' }) => {
    const [activeCardIndex, setActiveCardIndex] = useState(null);

    const tabs = [
        { label: 'Офисы', value: 'office' },
        { label: 'Производственно-складские', value: 'industrial' },
        { label: 'Торговые', value: 'commercial' },
        { label: 'Участки', value: 'land' }
    ];

    const handleCardClick = (card, index) => {
        setActiveCardIndex(index);
    };

    const copyToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    };

    const generateSocialLink = (platform) => {
        if (activeCardIndex !== null) {
            const activeCard = cards[activeCardIndex];
            const message = `Интересует лот артикул ${activeCard.article}`;
            const encodedMessage = encodeURIComponent(message);

            switch (platform) {
                case 'Telegram':
                    return `https://t.me/langbey?text=${encodedMessage}`;
                case 'Whatsapp':
                    return `https://api.whatsapp.com/send?phone=+8618717766242&text=${encodedMessage}`;
                case 'Viber':
                    return `viber://pa?chatURI=test_bot&text=${encodedMessage}`;
                case 'Phone':
                    return `tel:+11111111`;
                default:
                    return '#';
            }
        }
        return '#';
    };

    const handleSocialClick = (platform) => {
        if (activeCardIndex !== null) {
            const activeCard = cards[activeCardIndex];
            const message = `Интересует лот артикул ${activeCard.article}`;
            copyToClipboard(message);
            const link = generateSocialLink(platform);
            window.open(link, '_blank');
        }
    };

    return (
        <div className={`listing ${modifier ? 'listing--' + modifier : ''}`}>
            {modifier == 'main' && <h2 className="listing__title">Свободные помещения</h2>}
            {modifier == 'search' && <h2 className="listing__title">Найдено для вас</h2>}

            {modifier == 'main' && (
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

                <div className="listing__column listing__column--right">
                    <div className="listing__pagination">
                        <div className="listing__pagination--line">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="listing__pagination--button"
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
                                className="listing__pagination--button"
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

                    {modifier == 'main' && (
                        <div className="listing__socials">
                            <ul class="listing__socials--list">
                                <li class="listing__socials--item">
                                    <a href={generateSocialLink('Phone')} className="listing__socials--link" target="_blank" rel="nofollow noopener">
                                        <IconSprite
                                            selector="PhoneIcon"
                                            width="30"
                                            height="30"
                                            fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                        />
                                    </a>
                                </li>
                                <li className="listing__socials--item">
                                    <a onClick={() => handleSocialClick('Telegram')} className="listing__socials--link">
                                        <IconSprite
                                            selector="TelegramIcon"
                                            width="30"
                                            height="30"
                                            fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                        />
                                    </a>
                                </li>
                                <li className="listing__socials--item">
                                    <a onClick={() => handleSocialClick('Whatsapp')} className="listing__socials--link">
                                        <IconSprite
                                            selector="WhatsappIcon"
                                            width="30"
                                            height="30"
                                            fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                        />
                                    </a>
                                </li>
                                <li className="listing__socials--item">
                                    <a onClick={() => handleSocialClick('Viber')} className="listing__socials--link">
                                        <IconSprite
                                            selector="ViberIcon"
                                            width="30"
                                            height="30"
                                            fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {modifier == 'search' && (
                <div className="listing__socials">
                    <ul class="listing__socials--list">
                        {modifier == 'main' && (
                            <li class="listing__socials--item">
                                <a href={generateSocialLink('Phone')} className="listing__socials--link" target="_blank" rel="nofollow noopener">
                                    <IconSprite
                                        selector="PhoneIcon"
                                        width="30"
                                        height="30"
                                        fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                    />
                                </a>
                            </li>
                        )}
                        <li className="listing__socials--item">
                            <a onClick={() => handleSocialClick('Telegram')} className="listing__socials--link">
                                <IconSprite
                                    selector="TelegramIcon"
                                    width="30"
                                    height="30"
                                    fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                />
                            </a>
                        </li>
                        <li className="listing__socials--item">
                            <a onClick={() => handleSocialClick('Whatsapp')} className="listing__socials--link">
                                <IconSprite
                                    selector="WhatsappIcon"
                                    width="30"
                                    height="30"
                                    fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                />
                            </a>
                        </li>
                        <li className="listing__socials--item">
                            <a onClick={() => handleSocialClick('Viber')} className="listing__socials--link">
                                <IconSprite
                                    selector="ViberIcon"
                                    width="30"
                                    height="30"
                                    fill={currentPage === totalPages ? '#676767' : '#F9BC07'}
                                />
                            </a>
                        </li>
                        {modifier == 'search' && (
                            <>
                                <li className="listing__socials--item">
                                    <a href="tel:+79120557755" className="listing__socials--phone">+7 (912) 055-77-55</a>
                                </li>
                                <li className="listing__socials--item">
                                    <a onClick={() => handleSocialClick('Phone')} className="listing__socials--call button">Закажите звонок</a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CardList;

