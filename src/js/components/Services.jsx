import React, { useState, useRef, useEffect, forwardRef } from 'react';

import IconSprite from '../includes/IconSprite';
import localization from '../../../assets/json/localization.json';

const Services = forwardRef(({ currentLang, callForm }, ref) => {
    const services = [
        {
            type: 'webdev',
            title: localization[currentLang].webdevTitle,
            summary: localization[currentLang].webdevDesc,
            icons: [
                {
                    name: 'ReactIcon',
                    width: 80,
                    height: 70,
                },
                {
                    name: 'VueIcon',
                    width: 70,
                    height: 70,
                },
                {
                    name: 'NodeIcon',
                    width: 169,
                    height: 50,
                },
                {
                    name: 'PythonIcon',
                    width: 191,
                    height: 50,
                },
            ]
        },
        {
            type: 'smm',
            title: localization[currentLang].smmTitle,
            summary: localization[currentLang].smmDesc,
            icons: [
                {
                    name: 'FacebookIcon',
                },
                {
                    name: 'InstagramIcon',
                },
                {
                    name: 'WhatsappIcon',
                },
                {
                    name: 'LinkedinIcon',
                },
                {
                    name: 'YoutubeIcon',
                },
                {
                    name: 'PinterestIcon',
                },
            ]
        },
        {
            type: 'seo',
            title: localization[currentLang].seoTitle,
            summary: localization[currentLang].seoDesc,
            icons: [
                {
                    name: 'TargetIcon',
                    width: 111,
                    height: 110,
                },
                {
                    name: 'SeoIcon',
                    width: 165,
                    height: 80,
                },
            ]
        },
        {
            type: 'design',
            title: localization[currentLang].designTitle,
            summary: localization[currentLang].designDesc,
            icons: [
                {
                    name: 'PhotoshopIcon',
                    width: 83,
                    height: 80,
                },
                {
                    name: 'IndesignIcon',
                    width: 83,
                    height: 80,
                },
                {
                    name: 'AiIcon',
                    width: 83,
                    height: 80,
                },
                {
                    name: 'FigmaIcon',
                    width: 53,
                    height: 80,
                },
                {
                    name: 'BlenderIcon',
                    width: 98,
                    height: 80,
                },
            ]
        },
        {
            type: 'tg',
            title: localization[currentLang].tgTitle,
            summary: localization[currentLang].tgDesc,
            icons: [
                {
                    name: 'BotIcon',
                    width: 187,
                    height: 170,
                },
            ]
        },
        {
            type: 'analytics',
            title: localization[currentLang].analyticsTitle,
            summary: localization[currentLang].analyticsDesc,
            icons: [
                {
                    name: 'GraphIcon',
                    width: 203,
                    height: 172,
                },
            ]
        },
    ];
    const servicesFooterRef = useRef(null);
    const leadButtonRef = useRef(null);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedService, setSelectedService] = useState(services[selectedIndex]);
    // const [isAnimated, setIsAnimated] = useState(false);
    // const [timer, setTimer] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!servicesFooterRef.current || !leadButtonRef.current) return;

            const footer = servicesFooterRef.current;
            const button = leadButtonRef.current;

            const footerRect = footer.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();

            if (footerRect.bottom - 100 <= window.innerHeight) {
                button.classList.add('sticky-bottom');
            } else {
                button.classList.remove('sticky-bottom');
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // useEffect(() => {
    //     const timerHelper = setTimeout(() => {
    //         setIsAnimated(true);
    //     }, 10);        

    //     return () => {
    //             setIsAnimated(false);
    //             clearTimeout(timerHelper);
    //     }
    // }, [selectedIndex]);

    const handleSelectIndex = (index) => {
        setSelectedIndex(index);
        selectService(services[index]);
    };

    const nextSlide = () => {
        const newIndex = (selectedIndex + 1) % services.length;
        setSelectedIndex(newIndex);
        selectService(services[newIndex]);
    };

    const prevSlide = () => {
        const newIndex = selectedIndex > 0 ? selectedIndex - 1 : services.length - 1;
        setSelectedIndex(newIndex);
        selectService(services[newIndex]);
    };

    const selectService = (service) => {
        setSelectedService(service);
    };

    const openForm = () => {
        callForm();
    }

    return (
        <section className="section services" ref={ref}>
            <div class="container container__noPadding">
                <div className="services__wrapper">
                    <div className="services__header">
                        <button className="services__button services__prev button" onClick={() => prevSlide()}>
                            <span className="services__button--text">//<br />ba<br />ck</span>
                        </button>
                        <div className="services__poster">
                            <div className="services__text">
                                <div className="services__title" key={selectedService.type}>
                                    <span className="services__title--text">{selectedService.title}</span>
                                </div>
                                <div className="services__summary">{selectedService.summary}</div>
                            </div>
                            <div className={"services__icons services__icons--" + selectedService.type}>
                                {selectedService.icons.map((icon) => (
                                    <IconSprite key={icon.name} selector={icon.name} width={icon.width || 64} height={icon.height || 64} />
                                ))}
                            </div>
                        </div>
                        <button className="services__button services__next button" onClick={() => nextSlide()}>
                            <span className="services__button--text">//<br />ne<br />xt</span>
                        </button>
                    </div>

                    <div className="services__footer" ref={servicesFooterRef}>
                        <ul className="services__list">
                            {services.map((service, index) => (
                                <li key={index} className={"services__item" + (index == selectedIndex ? " active" : "")} onClick={() => handleSelectIndex(index)}>
                                    {service.title}
                                </li>
                            ))}
                        </ul>

                        <div className="services__lead">
                            <button className="services__lead--button" onClick={() => openForm()} ref={leadButtonRef}>
                                <IconSprite selector="FormIcon" width="242" height="344" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default Services;
