// const buildingFloors = {
//     'depot-building-1': [Building1Floor0, Building1Floor1, Building1Floor2],
//     'depot-building-2': [Building1Floor0, Building1Floor0],
//     'depot-building-3': [Building1Floor1, Building1Floor2],
//     'depot-building-4': [Building1Floor1, Building1Floor2],
//     'depot-building-5': [Building1Floor1, Building1Floor2],
//     'depot-building-6': [Building1Floor1, Building1Floor2],
//     'depot-building-7': [Building1Floor1, Building1Floor2],
//     'depot-building-8': [Building1Floor1, Building1Floor2],
//     'depot-building-9': [Building1Floor1, Building1Floor2],
//     'depot-building-10': [Building1Floor1, Building1Floor2],
//     'depot-building-11': [Building1Floor1, Building1Floor2],
//     'depot-building-12': [Building1Floor1, Building1Floor2],
//     'depot-building-13': [Building1Floor1, Building1Floor2],
// };

import React, { useState, useEffect, useRef, Suspense } from 'react';
import LoadingSpinner from '../includes/LoadingSpinner';
import Territory from '../includes/maps/Territory';
import FloorMap from '../includes/maps/FloorMap';

const Scheme = ({ activeElements = [] }) => {
    const [elements, setElements] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [floors, setFloors] = useState([]);
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

    const handleClick = async (event) => {
        const { dataset } = event.target;
        if (dataset.id) {
            setSelectedBuilding(dataset.id);
            setShowModal(true);
            const floors = await loadFloors(dataset.id);
            setFloors(floors);
        }
    };

    const loadFloors = async (buildingId) => {
        switch (buildingId) {
            case 'depot-building-1':
                return [
                    React.lazy(() => import('../includes/maps/P/Floor0')),
                    React.lazy(() => import('../includes/maps/P/Floor1')),
                    React.lazy(() => import('../includes/maps/P/Floor2'))
                ];
            case 'depot-building-2':
                return [
                    React.lazy(() => import('../includes/maps/P/Floor0')),
                    React.lazy(() => import('../includes/maps/P/Floor0'))
                ];
            case 'depot-building-3':
                return [
                    React.lazy(() => import('../includes/maps/P/Floor1')),
                    React.lazy(() => import('../includes/maps/P/Floor2'))
                ];
            // Добавьте остальные здания здесь...
            default:
                return [];
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBuilding(null);
    };

    return (
        <div className="scheme">
            <Territory ref={svgRef} />
            {showModal && selectedBuilding && (
                <div className="scheme__popup">
                    <button className="scheme__close button button--close" onClick={closeModal}></button>
                    <Suspense fallback={<LoadingSpinner />}>
                        <FloorMap floors={floors} />
                    </Suspense>
                </div>
            )}
        </div>
    );
};

export default Scheme;
