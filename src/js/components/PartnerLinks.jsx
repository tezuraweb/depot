import React from 'react';
import IconSprite from '../includes/IconSprite';

const PartnerLinks = ({ siteName }) => {
    const orgs = {
        'depo': {
            link: 'https://depoarenda.ru',
            img: '/img/pics/depot.png',
            label: 'ДЕПО'
        },
        'yujnaya': {
            link: 'https://bazayug.ru',
            img: '/img/pics/yujnaya.png',
            label: 'База Южная'
        },
        'gagarinsky': {
            link: 'https://gagarinski.rent',
            img: '/img/pics/gagarinsky.png',
            label: 'ГАГАРИНСКИЙ'
        },
    }

    const orgsIndeces = {
        'depo': ['gagarinsky', 'yujnaya'],
        'yujnaya': ['depo', 'gagarinsky'],
        'gagarinsky': ['depo', 'yujnaya'],
    }

    const partners = orgsIndeces[siteName];

    return (
        <div className="listing__partners">
            <div className="listing__partners--title">Еще больше объектов на сайтах партнеров</div>
            <div className="listing__cards">
                <div className="listing__partners--item">
                    <a className="listing__partners--card" href={orgs[partners[0]].link} target="_blank" aria-label={orgs[partners[0]].label} rel="noopener noreferrer">
                        <div className="listing__partners--pic">
                            <img
                                src={orgs[partners[0]].img}
                                alt="gagarinsky"
                                className="listing__partners--img"
                            />
                        </div>
                        <div className="listing__partners--icon">
                            <IconSprite
                                selector="ExternalLinkIcon"
                                width="30"
                                height="30"
                                fill="#F9BC07"
                            />
                        </div>
                    </a>
                </div>
                <div className="listing__partners--item">
                    <a className="listing__partners--card" href={orgs[partners[1]].link} target="_blank" aria-label={orgs[partners[1]].label} rel="noopener noreferrer">
                        <div className="listing__partners--pic">
                            <img
                                src={orgs[partners[1]].img}
                                alt="yujnaya"
                                className="listing__partners--img"
                            />
                        </div>
                        <div className="listing__partners--icon">
                            <IconSprite
                                selector="ExternalLinkIcon"
                                width="30"
                                height="30"
                                fill="#F9BC07"
                            />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PartnerLinks;

