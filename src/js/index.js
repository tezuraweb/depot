import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import store from './redux/store';
import App from './app';
import ymaps from 'ymaps';

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        // <Provider store={store}>
        <App />,
        // </Provider>,
        document.getElementById('root')
    );
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