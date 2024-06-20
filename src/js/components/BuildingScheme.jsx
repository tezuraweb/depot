import React, { useState, useEffect, useRef } from 'react';
import FloorMap from '../includes/FloorMap';

import Territory from '../includes/maps/Territory';
import Building1Floor0 from '../includes/maps/P/Floor0';
import Building1Floor1 from '../includes/maps/P/Floor1';
import Building1Floor2 from '../includes/maps/P/Floor2';

const buildingFloors = {
    'depot-building-1': [Building1Floor0, Building1Floor1, Building1Floor2],
    'depot-building-2': [Building1Floor0, Building1Floor0],
    'depot-building-3': [Building1Floor1, Building1Floor2],
    'depot-building-4': [Building1Floor1, Building1Floor2],
    'depot-building-5': [Building1Floor1, Building1Floor2],
    'depot-building-6': [Building1Floor1, Building1Floor2],
    'depot-building-7': [Building1Floor1, Building1Floor2],
    'depot-building-8': [Building1Floor1, Building1Floor2],
    'depot-building-9': [Building1Floor1, Building1Floor2],
    'depot-building-10': [Building1Floor1, Building1Floor2],
    'depot-building-11': [Building1Floor1, Building1Floor2],
    'depot-building-12': [Building1Floor1, Building1Floor2],
    'depot-building-13': [Building1Floor1, Building1Floor2],
};

const BuildingScheme = ({ activeElements = [] }) => {
    const [elements, setElements] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;

        if (svg) {
            const els = svg.querySelectorAll('[data-id]');
            setElements(els);
        }
    }, []);

    useEffect(() => {
        elements.forEach((element) => {
            const id = element.dataset.id;

            if (activeElements.includes(id)) {
                element.classList.add('active');
                element.addEventListener('click', handleClick);
            } else {
                element.classList.remove('active');
                element.removeEventListener('click', handleClick);
            }
        });

        return () => {
            elements.forEach((element) => {
                element.removeEventListener('click', handleClick);
            });
        };
    }, [elements, activeElements]);

    const handleClick = (event) => {
        const { dataset } = event.target;
        if (dataset.id) {
            setSelectedBuilding(dataset.id);
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBuilding(null);
    };

    return (
        <div className="building-scheme">
            <Territory ref={svgRef} />
            {showModal && selectedBuilding && (
                <div className="modal">
                    <div className="modal__content">
                        <button className="button button--close" onClick={closeModal}></button>
                        <FloorMap floors={buildingFloors[selectedBuilding]} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuildingScheme;