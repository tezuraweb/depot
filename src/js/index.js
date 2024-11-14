import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ymaps from 'ymaps';
import LoadingSpinner from './includes/LoadingSpinner';
import { ViewportProvider } from './utils/ViewportContext';

const siteName = process.env.REACT_APP_SITE_NAME;

const loadComponent = (componentName) => {
    switch (componentName) {
        case 'mainFilter':
            return lazy(() => import('./components/MainFilter'));
        case 'contactForm':
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
        case 'login':
            return lazy(() => import('./components/AuthLogin'));
        case 'signup':
            return lazy(() => import('./components/AuthRegister'));
        case 'resetPassword':
            return lazy(() => import('./components/AuthReset'));
        case 'premisesEditor':
            return lazy(() => import('./components/PremisesEditor'));

        default:
            return null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-react-component]');

    const renderApp = (componentName, container) => {
        const Component = loadComponent(componentName);

        if (!Component) return;

        ReactDOM.render(
            <ViewportProvider>
                <Router>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            {componentName === 'premises' && <Route path="/premises/:id" element={<Component siteName={siteName} />} />}
                            {componentName === 'signup' && (
                                <>
                                    <Route path="/auth/signup" element={<Component mode="signup" siteName={siteName} />} />
                                    <Route path="/auth/password-reset" element={<Component mode="password-reset" />} />
                                </>
                            )}
                            {componentName === 'resetPassword' && (
                                <>
                                    <Route path="/auth/reset/:token" element={<Component />} />
                                    <Route path="/auth/verify/:token" element={<Component />} />
                                </>
                            )}
                            {componentName === 'webReport' && (
                                <>
                                    <Route path="/api/report/print/depot" element={<Component base="depot" />} />
                                    <Route path="/api/report/print/gagarinsky" element={<Component base="gagarinsky" />} />
                                    <Route path="/api/report/print/yujnaya" element={<Component base="yujnaya" />} />
                                    <Route path="/backoffice/report" element={<Component />} />
                                </>
                            )}
                            {(componentName === 'mainFilter' || componentName === 'partnerCardList' || componentName === 'searchPage' || componentName === 'partnerLinks') && (
                                <Route path="*" element={<Component siteName={siteName} />} />
                            )}
                            {(componentName !== 'premises' && componentName !== 'signup' && componentName !== 'resetPassword' && componentName !== 'webReport' && componentName !== 'mainFilter' && componentName !== 'partnerCardList' && componentName !== 'searchPage' && componentName !== 'partnerLinks') && (
                                <Route path="*" element={<Component {...(componentName === 'contactFormModal' && { modal: true })} />} />
                            )}
                        </Routes>
                    </Suspense>
                </Router>
            </ViewportProvider>,
            container
        );
    };

    containers.forEach((container) => {
        const componentName = container.getAttribute('data-react-component');
        renderApp(componentName, container);
    });
});

let geoIconUrl = '';
let geoIconText = '';
let coords = [0, 0];
if (siteName == 'depo') {
    coords = [56.881433, 53.230957];
    geoIconUrl = '/img/icons/geoIconDepot.svg';
    geoIconText = 'Торгово-складской комплекс «Депо»';
} else if (siteName == 'gagarinsky') {
    coords = [56.813794, 53.189864];
    geoIconUrl = '/img/icons/geoIconGagarinsky.svg';
    geoIconText = 'Торгово-складской комплекс «Гагаринский»';
} else if (siteName == 'yujnaya') {
    coords = [56.813036, 53.205931];
    geoIconUrl = '/img/icons/geoIconYujnaya.svg';
    geoIconText = 'Торгово-складской комплекс «База Южная»';
}

ymaps
    .load()
    .then(maps => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.style.height = "100%";
            mapContainer.style.width = "100%";

            const map = new maps.Map(mapContainer, {
                center: coords,
                zoom: 15,
                controls: [],
            });

            const myPlacemark = new maps.Placemark(map.getCenter(), {
                hintContent: geoIconText,
                balloonContent: geoIconText
            }, {
                iconLayout: 'default#image',
                iconImageHref: geoIconUrl,
                iconImageSize: [40, 40],
            });

            map.geoObjects.add(myPlacemark);
        }
    })
    .catch(error => console.log('Failed to load Yandex Maps', error));
