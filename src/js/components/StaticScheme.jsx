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

const Scheme = ({ activeElement, floor }) => {
    const [floors, setFloors] = useState([]);
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;

        if (svg) {
            const element = svg.querySelector(`[data-id="${activeElement}"]`);
            if (element) {
                element.classList.add('active');
            }
        }
    }, []);

    useEffect(() => {
        const loadFloor = async () => {
            const floors = await loadFloors(activeElement);
            console.log(activeElement, floors);
            setFloors(floors);
        };

        if (activeElement) {
            loadFloor();
        }
    }, [activeElement]);

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

    return (
        <div className="scheme">
            <div className="scheme__row">
                <div className="scheme__column">
                    <Suspense fallback={<LoadingSpinner />}>
                        <FloorMap floors={floors} floor={floor}/>
                    </Suspense>
                </div>
                <div className="scheme__column">
                    <Territory ref={svgRef} />
                </div>
            </div>
        </div>
    );
};

export default Scheme;
