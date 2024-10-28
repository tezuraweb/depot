import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';

const FloorMap = ({ floors = [], controls = false, buildingId = null, selectedRoomData = null }) => {
    const [activeFloor, setActiveFloor] = useState(0);
    const [rooms, setRooms] = useState([]);
    const svgRef = useRef(null);
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            if (buildingId) {
                try {
                    const response = await axios.get(`/api/premises/floormap/${buildingId}`);
                    setRooms(response.data);
                } catch (error) {
                    console.error('Error fetching rooms:', error);
                }
            }
        };

        if (controls) {
            fetchRooms();
        }
    }, [buildingId]);

    const setSvgRef = useCallback((node) => {
        if (node !== null) {
            svgRef.current = node;
            const els = node.querySelectorAll('[data-id]');
            setElements(els);
        }
    }, [activeFloor]);

    useEffect(() => {
        const handleElementClick = (event) => {
            const roomCode = event.target.dataset.id;
            const room = rooms.find((r) => r?.room_codes?.includes(roomCode));
            if (room) {
                window.location.href = `/premises/${room.id}`;
            }
        };
    
        const handleElementHover = (event) => {
            const roomCode = event.target.dataset.id;
            const hoveredRoom = rooms.find((r) => r?.room_codes?.includes(roomCode));
            if (hoveredRoom) {
                elements.forEach((el) => {
                    if (el.dataset.id === roomCode || hoveredRoom?.room_codes?.includes(el.dataset.id)) {
                        el.classList.add('hovered');
                    }
                });
            }
        };
    
        const handleElementMouseOut = () => {
            elements.forEach((el) => el.classList.remove('hovered'));
        };
    
        elements.forEach((element) => {
            if (controls) {
                element.addEventListener('click', handleElementClick);
                element.addEventListener('mouseover', handleElementHover);
                element.addEventListener('mouseout', handleElementMouseOut);
                if (rooms?.length > 0) {
                    const vacantRoom = rooms.find((r) => r?.room_codes?.includes(element.dataset.id));
                    if (vacantRoom) {
                        element.classList.add('clickable');
                        element.classList.add('active');
                    }
                }
            } else if (selectedRoomData.roomCodes.includes(element.dataset.id)) {
                element.addEventListener('click', handleElementClick);
                element.classList.add('active');
            }
        });
    
        return () => {
            elements.forEach((element) => {
                if (controls) {
                    element.removeEventListener('click', handleElementClick);
                    element.removeEventListener('mouseover', handleElementHover);
                    element.removeEventListener('mouseout', handleElementMouseOut);
                } else if (selectedRoomData.roomCodes.includes(element.dataset.id)) {
                    element.removeEventListener('click', handleElementClick);
                }
            });
        };
    }, [elements, rooms, controls, selectedRoomData]);

    const handleClick = (index) => {
        setActiveFloor(index);
    };

    const ActiveFloorComponent = floors[activeFloor];

    return (
        <div className="scheme__floor-map">
            {controls && (
                <div className="scheme__controls">
                    {floors.map((FloorComponent, index) => (
                        <button
                            className={`scheme__button button ${activeFloor !== index ? 'button--grey' : ''}`}
                            key={index}
                            onClick={() => handleClick(index)}
                        >
                            Этаж {index + 1}
                        </button>
                    ))}
                </div>
            )}
            <div className="scheme__content">
                {ActiveFloorComponent && (
                    <Suspense fallback={<LoadingSpinner />}>
                        <ActiveFloorComponent ref={setSvgRef} />
                    </Suspense>
                )}
            </div>
        </div>
    );
};

export default FloorMap;
