import React from 'react';
import IconSprite from './IconSprite';
import ContactForm from '../components/ContactForm';

const Share = ({ activeCard, modifier, siteName }) => {
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error('Failed to copy: ', error);
        }
    };

    const generateSocialLink = (platform) => {
        let tg = '', whatsapp = '';
        if (siteName === 'depo') {
            tg = '+79120557755';
            whatsapp = '+79120557755';
        } else if (siteName === 'gagarinsky') {
            tg = '+79120203331';
            whatsapp = '+79120203331';
        } else if (siteName === 'yujnaya') {
            tg = 'Oksanagv5';
            whatsapp = '+79511974777';
        }

        if (activeCard) {
            const message = `Интересует лот ${link}`;
            const encodedMessage = encodeURIComponent(message);

            switch (platform) {
                case 'Telegram':
                    return `https://t.me/${tg}?text=${encodedMessage}`;
                case 'Whatsapp':
                    return `https://api.whatsapp.com/send?phone=${whatsapp.replace(/[\+\s\-\(\)]/g, '')}&text=${encodedMessage}`;
                case 'Vk':
                    return `https://vk.me/depoizh&text=${encodedMessage}`;
                default:
                    return '#';
            }
        } else {
            switch (platform) {
                case 'Telegram':
                    return `https://t.me/${tg}`;
                case 'Whatsapp':
                    return `https://api.whatsapp.com/send?phone=${whatsapp.replace(/[\+\s\-\(\)]/g, '')}`;
                case 'Vk':
                    return `https://vk.me/depoizh`;
                default:
                    return '#';
            }
        }
    };

    const handleSocialClick = (platform) => {
        if (activeCard) {
            const message = `Интересует лот ${link}`;
            copyToClipboard(message);
        }
        const socialLink = generateSocialLink(platform);
        window.open(socialLink, '_blank');
    };

    const link = activeCard ? window.location.origin + '/premises/' + activeCard.id : '';

    return (
        <div className={`share ${modifier ? 'share--' + modifier : ''}`}>
            <ul className="share__list">
                {modifier == 'phoneSmall' && (
                    <li className="share__item">
                        <ContactForm modal={true} modifier="share" buttonView="icon" url={link} />
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

                {modifier == 'phoneLarge' && (
                    <>
                        {/* <li className="share__item">
                            <a href="tel:+73412794040" className="share__phone">+7 (3412) 79-40-40</a>
                        </li> */}
                        <li className="share__item">
                            <ContactForm modal={true} modifier="share" url={link} />
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Share;
