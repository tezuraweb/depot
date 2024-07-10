import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ymaps from 'ymaps';
import LoadingSpinner from './includes/LoadingSpinner';
import { ViewportProvider } from './utils/ViewportContext';

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
        case 'rentedCardList':
            return lazy(() => import('./components/RentedCardList'));
        case 'documents':
            return lazy(() => import('./components/DocumentsList'));
        case 'requests':
            return lazy(() => import('./components/RequestsList'));
        case 'siteEditor':
            return lazy(() => import('./components/SiteEditor'));
        case 'webReport':
            return lazy(() => import('./components/Report'));
        case 'tickets':
            return lazy(() => import('./components/Tickets'));
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
            if (componentName == 'premises') {
                ReactDOM.render(
                    <ViewportProvider>
                        <Router>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    <Route path="/premises/:id" element={<Component />} />
                                </Routes>
                            </Suspense>
                        </Router>
                    </ViewportProvider>,
                    container
                );
            } else {
                ReactDOM.render(
                    <ViewportProvider>
                        <Suspense fallback={<LoadingSpinner />}>
                            <Component {...(componentName === 'contactFormModal' && { modal: true })} />
                        </Suspense>
                    </ViewportProvider>,
                    container
                );
            }

        }
    });
});

ymaps
    .load()
    .then(maps => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.style.height = "100%";
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
