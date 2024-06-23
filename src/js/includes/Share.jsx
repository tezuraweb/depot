import React from 'react';
import IconSprite from './IconSprite';

const Share = ({ activeCard, modifier }) => {

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied to clipboard');
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    };

    const generateSocialLink = (platform) => {
        if (activeCard) {
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
        if (activeCard) {
            const message = `Интересует лот артикул ${activeCard.article}`;
            copyToClipboard(message);
            const link = generateSocialLink(platform);
            window.open(link, '_blank');
        }
    };

    return (
        <div className={`share ${modifier ? 'share--' + modifier : ''}`}>
            <ul className="share__list">
                {modifier == 'phoneSmall' && (
                    <li className="share__item">
                        <a href={generateSocialLink('Phone')} className="share__link" target="_blank" rel="nofollow noopener">
                            <IconSprite
                                selector="PhoneIcon"
                                width="30"
                                height="30"
                            />
                        </a>
                    </li>
                )}
                <li className="share__item">
                    <a onClick={() => handleSocialClick('Telegram')} className="share__link">
                        <IconSprite
                            selector="TelegramIcon"
                            width="30"
                            height="30"
                        />
                    </a>
                </li>
                <li className="share__item">
                    <a onClick={() => handleSocialClick('Whatsapp')} className="share__link">
                        <IconSprite
                            selector="WhatsappIcon"
                            width="30"
                            height="30"
                        />
                    </a>
                </li>
                <li className="share__item">
                    <a onClick={() => handleSocialClick('Viber')} className="share__link">
                        <IconSprite
                            selector="ViberIcon"
                            width="30"
                            height="30"
                        />
                    </a>
                </li>
                {modifier == 'phoneLarge' && (
                    <>
                        <li className="share__item">
                            <a href="tel:+79120557755" className="share__phone">+7 (912) 055-77-55</a>
                        </li>
                        <li className="share__item">
                            <a onClick={() => handleSocialClick('Phone')} className="share__call button">Закажите звонок</a>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Share;
