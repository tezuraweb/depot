import React, { useState, useEffect, useRef } from 'react';
import { debounce } from "lodash";

import Sparkle from './Sparkle';
import localization from '../../../assets/json/localization.json';

const HeroSection = ({ scrollToServices, changeCurrency, currentLang, currencies, selectedCurrency, callForm }) => {
    const langs = ['en', 'ru'];

    const [langListVisible, setLangListVisible] = useState(false);
    const [currencyListVisible, setCurrencyListVisible] = useState(false);
    const [usedCurrency, setUsedCurrency] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const currencySelectRef = useRef(null);
    const langSelectRef = useRef(null);
    const backgroundRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (currencySelectRef.current && !currencySelectRef.current.contains(event.target)) {
                setCurrencyListVisible(false);
            }
            if (langSelectRef.current && !langSelectRef.current.contains(event.target)) {
                setLangListVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (window.innerWidth <= 1024) {
            const background = backgroundRef.current;

            const returnToPosition = debounce(() => {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

                background.style.transform = `translateY(${currentScrollTop}px)`;
            }, 100);

            window.addEventListener('scroll', returnToPosition);

            return () => {
                window.removeEventListener('scroll', returnToPosition);
            };
        }
    }, []);

    useEffect(() => {
        setUsedCurrency(selectedCurrency);
    }, [selectedCurrency]);

    const formatTime = (time) => {
        return currentLang === 'en' ?
            time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) :
            time.toLocaleTimeString('ru-RU', { hour: 'numeric', minute: 'numeric', hour12: false });
    };


    const getGreeting = (currentLang, currentTime) => {
        const hour = currentTime.getHours();
        let greetingKey = 'greetingMorning';

        if (hour >= 6 && hour < 12) {
            greetingKey = 'greetingMorning';
        } else if (hour >= 12 && hour < 18) {
            greetingKey = 'greetingAfternoon';
        } else if (hour >= 18 && hour < 24) {
            greetingKey = 'greetingEvening';
        } else if (hour >= 0 && hour < 6) {
            greetingKey = 'greetingNight';
        }

        return localization[currentLang][greetingKey];
    };

    const handleScrollDown = () => {
        scrollToServices();
    };

    const handleCurrencySelectClick = () => {
        setCurrencyListVisible(!currencyListVisible);
    };

    const handleLangSelectClick = () => {
        setLangListVisible(!langListVisible);
    };


    const handleCurrencySelect = (index) => {
        setCurrencyListVisible(false);
        changeCurrency(index);
    };

    const openForm = () => {
        callForm();
    }

    return (
        <section className="section hero">
            <Sparkle />

            <div className="hero__background" ref={backgroundRef}>
                <div className='wave -three'></div>
                <div className='wave -four'></div>
                <div className='wave -one'></div>
                <div className='wave -two'></div>
            </div>
            <div className="container container__medium hero__container">
                <div className="hero__wrapper">
                    <div className="hero__top">
                        <div className="hero__date">
                            <div className="hero__date--time">
                                {formatTime(currentTime)}
                            </div>
                            <div className="hero__date--text">
                                {getGreeting(currentLang, currentTime)}
                            </div>
                        </div>
                        <button className="hero__button" onClick={() => openForm()}>
                            {localization[currentLang].start}
                        </button>
                        <div className="hero__select">
                            <div className="hero__select--block" ref={currencySelectRef}>
                                <div className="hero__select--active" onClick={() => handleCurrencySelectClick()}>{currencies[usedCurrency].symbol}</div>
                                <div className={'hero__select--list' + (currencyListVisible ? ' visible' : '')}>
                                    {currencies.map((currency, index) => (
                                        <div className={'hero__select--item' + (index == usedCurrency ? ' active' : '')} onClick={() => handleCurrencySelect(index)}>{currency.symbol}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="hero__select--block" ref={langSelectRef}>
                                <div className="hero__select--active" onClick={() => handleLangSelectClick()}>{currentLang}</div>
                                <div className={'hero__select--list' + (langListVisible ? ' visible' : '')}>
                                    {langs.map((lang) => (
                                        <a className={'hero__select--item' + (lang == currentLang ? ' active' : '')} href={'/' + lang}>{lang}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero__bottom">
                        <h1 className="hero__title">{localization[currentLang].title1}<br /><span className="hero__title--big">{localization[currentLang].title2}</span><br />{localization[currentLang].title3}</h1>
                        <div className="hero__links">
                            {/* <div className="hero__nav">
                                <div className="hero__nav--line"></div>
                                <div className="hero__nav--line"></div>
                                <div className="hero__nav--line"></div>
                            </div> */}
                            <button className="hero__arrow" onClick={handleScrollDown} aria-label="Scroll to services">
                                <div className="hero__arrow--line"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;