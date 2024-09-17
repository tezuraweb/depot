import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback, lazy } from 'react';
import LoadingSpinner from '../includes/LoadingSpinner';
import FloorMap from '../includes/maps/FloorMap';

const Scheme = ({ buildings = [], selectedElement = null, siteName }) => {
    const [elements, setElements] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [floors, setFloors] = useState([]);
    const [buildingData, setBuildingData] = useState(null);
    const svgRef = useRef(null);

    const activeElements = buildings.map(item => item.key_liter_id);

    const setSvgRef = useCallback((node) => {
        if (node !== null) {
            svgRef.current = node;
            const els = node.querySelectorAll('[data-id]');
            setElements(els);
        }
    }, []);

    useEffect(() => {
        elements.forEach((element) => {
            const id = parseInt(element.dataset.id);

            if (!isNaN(id) && activeElements.includes(id)) {
                if (selectedElement && selectedElement == id) {
                    element.classList.add('selected');
                } else {
                    element.classList.remove('selected');
                }
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
    }, [elements, activeElements, selectedElement]);

    useEffect(() => {
        setBuildingData(buildings.find((el) => el.key_liter_id == selectedBuilding))
    }, [selectedBuilding]);

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
        if (siteName === 'depo') {
            switch (buildingId) {
                default:
                    return [];
            }
        } else if (siteName === 'gagarinsky') {
            switch (buildingId) {
                default:
                    return [];
            }
        } else if (siteName === 'yujnaya') {
            switch (buildingId) {
                case '1':
                    return [React.lazy(() => import('../includes/maps/yujnaya/A_pr2/Floor1'))];
                case '14':
                    return [React.lazy(() => import('../includes/maps/yujnaya/B/Floor1'))];
                case '10':
                    return [
                        React.lazy(() => import('../includes/maps/yujnaya/V/Floor1')),
                        React.lazy(() => import('../includes/maps/yujnaya/V/Floor2'))
                    ];
                case '8':
                    return [React.lazy(() => import('../includes/maps/yujnaya/E/Floor1'))];
                case '7':
                    return [React.lazy(() => import('../includes/maps/yujnaya/P/Floor1'))];
                case '16':
                    return [React.lazy(() => import('../includes/maps/yujnaya/G/Floor1'))];
                case '9':
                    return [
                        React.lazy(() => import('../includes/maps/yujnaya/Zh/Floor1')),
                        React.lazy(() => import('../includes/maps/yujnaya/Zh/Floor2'))
                    ];
                case '3':
                    return [React.lazy(() => import('../includes/maps/yujnaya/Z/Floor1'))];
                case '15':
                    return [React.lazy(() => import('../includes/maps/yujnaya/I/Floor1'))];
                case '23':
                    return [React.lazy(() => import('../includes/maps/yujnaya/S/Floor1'))];
                case '5':
                    return [React.lazy(() => import('../includes/maps/yujnaya/D/Floor1'))];
                default:
                    return [];
            }
        }
    };

    const loadTerritory = (siteName) => {
        switch (siteName) {
            case 'depo':
                return lazy(() => import('../includes/maps/depo/Territory'));
            case 'gagarinsky':
                return lazy(() => import('../includes/maps/gagarinsky/Territory'));
            case 'yujnaya':
                return lazy(() => import('../includes/maps/yujnaya/Territory'));
            default:
                return null;
        }
    };

    const TerritoryComponent = useMemo(() => loadTerritory(siteName), [siteName]);

    const closeModal = () => {
        setShowModal(false);
        setSelectedBuilding(null);
    };

    return (
        <div className="scheme">
            <Suspense fallback={<LoadingSpinner />}>
                <TerritoryComponent ref={setSvgRef} />
            </Suspense>
            {showModal && selectedBuilding && (
                <div className="scheme__popup">
                    <div className="flex flex--sb flex--center">
                        <div className="scheme__title">Литер <span className="scheme__title--large">{buildingData.key_liter}</span></div>
                        <button className="scheme__close button button--close" onClick={closeModal}></button>
                    </div>
                    {floors.length > 0 ? (
                        <Suspense fallback={<LoadingSpinner />}>
                            <FloorMap floors={floors} controls={true} buildingId={buildingData.key_liter_id} />
                        </Suspense>
                    ) : (
                        <div className="scheme__disclaimer">План этажей будет добавлен в скором времени.<br /> Приносим извинения за доставленные неудобства.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Scheme;
