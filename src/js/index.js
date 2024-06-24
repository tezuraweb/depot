import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import ymaps from 'ymaps';
import LoadingSpinner from './includes/LoadingSpinner';

const loadComponent = (componentName) => {
    switch (componentName) {
        case 'mainFilter':
            return lazy(() => import('./components/MainFilter'));
        case 'contactForm':
            return lazy(() => import('./components/ContactForm'));
        case 'contactFormModal':
            return lazy(() => import('./components/ContactForm'));
        case 'partnerCardList':
            return lazy(() => import('./components/PartnerCardList'));
        case 'searchPage':
            return lazy(() => import('./components/SearchPage'));
        case 'partnerLinks':
            return lazy(() => import('./components/PartnerLinks'));
        case 'premises':
            return lazy(() => import('./components/Premises'));
        case 'manager':
            return lazy(() => import('./components/Manager'));
        case 'tenants':
            return lazy(() => import('./components/Tenants'));
        case 'gallery':
            return lazy(() => import('./components/Gallery'));
        case 'presentation':
            return lazy(() => import('./components/Presentation'));
        default:
            
            return null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-react-component]');
    
    containers.forEach((container) => {
        const componentName = container.getAttribute('data-react-component');
        const Component = loadComponent(componentName);
        
        if (Component) {
            ReactDOM.render(
                <Suspense fallback={<LoadingSpinner />}>
                    <Component {...(componentName === 'contactFormModal' && { modal: true })} />
                </Suspense>,
                container
            );
        }
    });
});

ymaps
    .load()
    .then(maps => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.style.height = "370px";
            mapContainer.style.width = "100%";

            const map = new maps.Map(mapContainer, {
                center: [-8.369326, 115.166023],
                zoom: 7
            });

            // var myPlacemark = new ymaps.Placemark(map.getCenter(), {
            //     hintContent: 'Custom marker',
            //     balloonContent: 'This is a custom marker'
            // }, {
            //     iconLayout: 'default#image',
            //     iconImageHref: '/img/icons/geoIcon.svg',
            //     iconImageSize: [30, 42],
            //     iconImageOffset: [-15, -42]
            // });

            var myPlacemark = new maps.Placemark(map.getCenter(), {
                hintContent: 'Default marker',
                balloonContent: 'This is a default marker'
            });
    
            map.geoObjects.add(myPlacemark);
        }
    })
    .catch(error => console.log('Failed to load Yandex Maps', error));
