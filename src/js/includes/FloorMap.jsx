import React, { useState, useEffect } from 'react';

const FloorMap = ({ floors = [] }) => {
    const [activeFloor, setActiveFloor] = useState(0);

    useEffect(() => {
        if (floors.length > 0) {
            setActiveFloor(0);
        }
    }, [floors]);

    const handleClick = (index) => {
        setActiveFloor(index);
    };

    const ActiveFloorComponent = floors[activeFloor];

    return (
        <div className="floor-map">
            <div className="floor-map__controls">
                {floors.map((FloorComponent, index) => (
                    <button key={index} onClick={() => handleClick(index)}>
                        Этаж {index + 1}
                    </button>
                ))}
            </div>
            <div className="floor-map__content">
                {ActiveFloorComponent && <ActiveFloorComponent />}
            </div>
        </div>
    );
};

export default FloorMap;
