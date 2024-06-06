import React, { useState } from 'react';

import localization from '../../../assets/json/localization.json';

const Projects = ({ currentLang, callForm }) => {
    const projects = [
        {
            id: 'webdev',
            link: '',
            title: localization[currentLang].proj1Title,
            summary: localization[currentLang].proj1Desc,
            cover: '/img/main/meditary.webp',
            width: '611'
        },
        {
            id: 'design',
            link: '',
            title: localization[currentLang].proj2Title,
            summary: localization[currentLang].proj2Desc,
            cover: '/img/main/school.webp',
            width: '393'
        },
        {
            id: 'interface',
            link: '',
            title: localization[currentLang].proj3Title,
            summary: localization[currentLang].proj3Desc,
            cover: '/img/main/tgbot.webp',
            width: '317'
        },
        {
            id: 'smm',
            link: '',
            title: localization[currentLang].proj4Title,
            summary: localization[currentLang].proj4Desc,
            cover: '/img/main/food.webp',
            width: '330'
        }
    ];

    const openForm = () => {
        callForm();
    }

    return (
        <section className="section cards" id="cards">
            <div className="container container__base">
                <h2 className="section__title">
                    <span className="section__title--text">{localization[currentLang].projectsTitle}</span>
                </h2>
            </div>
            <div className="container container__wide">
                <ul className="cards__list">
                    {projects.map((project) => (
                        <li key={project.id} className={`cards__item cards__item--${project.id}`}>
                            <div className="cards__wrapper">
                                <div className="cards__cover">
                                    <a href={project.link} className="cards__cover--link" aria-label="Link to project">
                                        <picture className="cards__cover--picture">
                                            <img className="cards__cover--img" src={project.cover} alt={project.title} width={project.width} height="330" />
                                        </picture>
                                    </a>
                                </div>
                                <div className="cards__text">
                                    <div className="cards__title">{project.title}</div>
                                    <div className="cards__summary">{project.summary}</div>
                                </div>
                                <a href={project.link} className="cards__button button" aria-label="Link to project"></a>
                            </div>
                        </li>
                    ))}

                    <li className="cards__item cards__item--button">
                        <div className="cards__wrapper">
                            <button className="cards__start" onClick={() => openForm()}>
                                {localization[currentLang].start}!
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default Projects;