import React from 'react';
import ReactDOM from 'react-dom';
import MainFilter from './components/MainFilter';
import ContactForm from './components/ContactForm';
import PartnerCardList from './components/PartnerCardList';
import SearchPage from './components/SearchPage';
import PartnerLinks from './components/PartnerLinks';
import ymaps from 'ymaps';

const componentMapping = {
    'mainFilter': MainFilter,
    'contactForm': ContactForm,
    'contactFormModal': ContactForm,
    'partnerCardList': PartnerCardList,
    'searchPage': SearchPage,
    'partnerLinks': PartnerLinks,
};

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-react-component]');
    
    containers.forEach(container => {
        const componentName = container.getAttribute('data-react-component');
        const Component = componentMapping[componentName];
        
        if (Component) {
            if (componentName == 'contactFormModal') {
                ReactDOM.render(
                    <Component modal={true} />,
                    container
                );
            } else {
                ReactDOM.render(
                    <Component />,
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