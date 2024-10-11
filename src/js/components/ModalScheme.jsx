import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback, lazy } from 'react';
import LoadingSpinner from '../includes/LoadingSpinner';
import FloorMap from '../includes/maps/FloorMap';

const Scheme = ({ buildings = [], selectedElement = null, siteName }) => {
    const [elements, setElements] = useState([]);
    const [selectedElementData, setSelectedElementData] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [floors, setFloors] = useState([]);
    const [buildingData, setBuildingData] = useState(null);
    const svgRef = useRef(null);

    const activeElements = buildings.map(item => item.key_liter);

    const setSvgRef = useCallback((node) => {
        if (node !== null) {
            svgRef.current = node;
            const els = node.querySelectorAll('[data-id]');
            setElements(els);
        }
    }, []);

    useEffect(() => {
        elements.forEach((element) => {
            const id = element.dataset.id;
            
            if (activeElements.includes(id)) {
                if (selectedElement && selectedElementData && selectedElementData?.key_liter == id) {
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
    }, [elements, activeElements, selectedElementData]);

    useEffect(() => {
        setBuildingData(buildings.find((el) => el.key_liter == selectedBuilding))
    }, [selectedBuilding]);

    useEffect(() => {
        setSelectedElementData(buildings.find((el) => el.key_liter_id == selectedElement))
    }, [selectedElement]);

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
                case 'Пр':
                    return [React.lazy(() => import('../includes/maps/depo/Pr/Floor1'))];
                case 'А':
                    return [React.lazy(() => import('../includes/maps/depo/A/Floor1'))];
                case 'Б':
                case 'Пр2':
                    return [React.lazy(() => import('../includes/maps/depo/B/Floor1'))];
                case 'В':
                    return [React.lazy(() => import('../includes/maps/depo/V/Floor1'))];
                case 'Е':
                    return [React.lazy(() => import('../includes/maps/depo/E/Floor1'))];
                case 'П':
                    return [
                        React.lazy(() => import('../includes/maps/depo/P/Floor1')),
                        React.lazy(() => import('../includes/maps/depo/P/Floor2')),
                        React.lazy(() => import('../includes/maps/depo/P/Floor3'))
                    ];
                case 'Г':
                    return [
                        React.lazy(() => import('../includes/maps/depo/G/Floor1')),
                        React.lazy(() => import('../includes/maps/depo/G/Floor2'))
                    ];
                case 'З':
                    return [React.lazy(() => import('../includes/maps/depo/Z/Floor1'))];
                case 'Т':
                    return [React.lazy(() => import('../includes/maps/depo/T/Floor1'))];
                case 'Д':
                    return [React.lazy(() => import('../includes/maps/depo/D/Floor1'))];
                default:
                    return [];
            }
        } else if (siteName === 'gagarinsky') {
            switch (buildingId) {
                case 'А':
                    return [
                        React.lazy(() => import('../includes/maps/gagarinsky/A/Floor1')),
                        React.lazy(() => import('../includes/maps/gagarinsky/A/Floor2')),
                        React.lazy(() => import('../includes/maps/gagarinsky/A/Floor3'))
                    ];
                case 'Б':
                    return [
                        React.lazy(() => import('../includes/maps/gagarinsky/B/Floor1')),
                        React.lazy(() => import('../includes/maps/gagarinsky/B/Floor2'))
                    ];
                case 'В':
                    return [React.lazy(() => import('../includes/maps/gagarinsky/V/Floor1'))];
                case 'Г':
                    return [React.lazy(() => import('../includes/maps/gagarinsky/G/Floor1'))];
                case 'Д':
                    return [React.lazy(() => import('../includes/maps/gagarinsky/D/Floor1'))];
                case 'Е':
                    return [React.lazy(() => import('../includes/maps/gagarinsky/E/Floor1'))];
                case 'Ж':
                    return [
                        React.lazy(() => import('../includes/maps/gagarinsky/J/Floor1')),
                        React.lazy(() => import('../includes/maps/gagarinsky/J/Floor2'))
                    ];
                case 'З':
                    return [React.lazy(() => import('../includes/maps/gagarinsky/Z/Floor1'))];
                case 'К':
                    return [
                        React.lazy(() => import('../includes/maps/gagarinsky/K/Floor1')),
                        React.lazy(() => import('../includes/maps/gagarinsky/K/Floor2'))
                    ];
                case 'Л':
                    return [
                        React.lazy(() => import('../includes/maps/gagarinsky/L/Floor1')),
                        React.lazy(() => import('../includes/maps/gagarinsky/L/Floor2'))
                    ];
                case 'Н':
                    return [React.lazy(() => import('../includes/maps/gagarinsky/N/Floor1'))];
                case 'П':
                    return [
                        React.lazy(() => import('../includes/maps/gagarinsky/P/Floor1')),
                        React.lazy(() => import('../includes/maps/gagarinsky/P/Floor2'))
                    ];
                case 'С':
                    return [React.lazy(() => import('../includes/maps/gagarinsky/S/Floor1'))];
                default:
                    return [];
            }
        } else if (siteName === 'yujnaya') {
            switch (buildingId) {
                case 'Пр':
                case 'Пр1':
                case 'Пр2':
                    return [
                        React.lazy(() => import('../includes/maps/yujnaya/A_pr2/Floor1')),
                        React.lazy(() => import('../includes/maps/yujnaya/A_pr2/Floor2'))
                    ];
                case 'А':
                    return [
                        React.lazy(() => import('../includes/maps/yujnaya/A/Floor1')),
                        React.lazy(() => import('../includes/maps/yujnaya/A/Floor2'))
                    ];
                case 'Б':
                    return [React.lazy(() => import('../includes/maps/yujnaya/B/Floor1'))];
                case 'В':
                    return [
                        React.lazy(() => import('../includes/maps/yujnaya/V/Floor1')),
                        React.lazy(() => import('../includes/maps/yujnaya/V/Floor2'))
                    ];
                case 'Е':
                    return [React.lazy(() => import('../includes/maps/yujnaya/E/Floor1'))];
                case 'П':
                    return [React.lazy(() => import('../includes/maps/yujnaya/P/Floor1'))];
                case 'Г':
                    return [
                        React.lazy(() => import('../includes/maps/yujnaya/G/Floor1')),
                        React.lazy(() => import('../includes/maps/yujnaya/G/Floor2'))
                    ];
                case 'Ж':
                    return [
                        React.lazy(() => import('../includes/maps/yujnaya/J/Floor1')),
                        React.lazy(() => import('../includes/maps/yujnaya/J/Floor2'))
                    ];
                case 'З':
                    return [React.lazy(() => import('../includes/maps/yujnaya/Z/Floor1'))];
                case 'И':
                    return [React.lazy(() => import('../includes/maps/yujnaya/I/Floor1'))];
                case 'С':
                    return [React.lazy(() => import('../includes/maps/yujnaya/S/Floor1'))];
                case 'Д':
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
                        <div className="scheme__title">Литер <span className="scheme__title--large">{buildingData?.key_liter}</span></div>
                        <button className="scheme__close button button--close" onClick={closeModal}></button>
                    </div>
                    {floors.length > 0 ? (
                        <Suspense fallback={<LoadingSpinner />}>
                            <FloorMap floors={floors} controls={true} buildingId={buildingData?.key_liter_id} />
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
