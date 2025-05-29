import React, { useState, useEffect } from 'react';

const CookieModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    const getCookiePolicyLink = () => {
        const currentUrl = window.location.hostname;
        if (currentUrl.includes('yuzhka') || currentUrl.includes('bazayug')) {
            return '/docs/depot/Политика_cookies_БЮ.pdf';
        } else if (currentUrl.includes('gagarinski')) {
            return '/docs/depot/Политика_cookies_Гагаринский.pdf';
        } else if (currentUrl.includes('depoarenda')) {
            return '/docs/depot/Политика_cookies_Депо.pdf';
        } else {
            return '/docs/depot/Политика_cookies_Депо.pdf';
        }
    };

    useEffect(() => {
        const cookieAccepted = localStorage.getItem('cookieAccepted');
        if (!cookieAccepted) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieAccepted', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="cookie">
            <div className="cookie__content">
                <div className="cookie__header">
                    <h2 className="cookie__title">Использование файлов cookie</h2>
                </div>
                <div className="cookie__body">
                    <p className="cookie__text">
                        Настоящий Сайт использует файлы cookie. Продолжая работу с Настоящим Сайтом,
                        вы подтверждаете свое согласие на обработку/использование cookies вашего браузера,
                        которые помогают нам делать этот Сайт удобнее для пользователей в порядке,
                        предусмотренном{' '}
                        <a
                            href={getCookiePolicyLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cookie__link"
                        >
                            Политикой по cookies
                        </a>
                        . В противном случае вы можете запретить сохранение/обработку файлов cookie
                        в настройках своего браузера или покинуть настоящий Интернет-ресурс.
                    </p>
                    <button
                        className="cookie__button"
                        onClick={handleAccept}
                    >
                        Согласен
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieModal;