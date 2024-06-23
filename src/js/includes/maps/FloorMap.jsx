import React, { useState, useEffect, Suspense } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const FloorMap = ({ floors = [], floor = null }) => {
    const [activeFloor, setActiveFloor] = useState(0);

    useEffect(() => {
        if (floor !== null) {
            setActiveFloor(floor);
        }
    }, [floor]);

    const handleClick = (index) => {
        setActiveFloor(index);
    };

    const ActiveFloorComponent = floors[activeFloor];

    return (
        <div className="floor-map">
            {floor === null && (
                <div className="floor-map__controls">
                    {floors.map((FloorComponent, index) => (
                        <button key={index} onClick={() => handleClick(index)}>
                            Этаж {index + 1}
                        </button>
                    ))}
                </div>
            )}
            <div className="floor-map__content">
                {ActiveFloorComponent && (
                    <Suspense fallback={<LoadingSpinner />}>
                        <ActiveFloorComponent />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default FloorMap;
