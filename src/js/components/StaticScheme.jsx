import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback, lazy } from 'react';
import LoadingSpinner from '../includes/LoadingSpinner';
import FloorMap from '../includes/maps/FloorMap';

const Scheme = ({ activeElement = null, siteName }) => {
    const [floors, setFloors] = useState([]);
    const svgRef = useRef(null);

    const setSvgRef = useCallback((node) => {
        if (node !== null) {
            svgRef.current = node;
            const elements = node.querySelectorAll(`[data-id="${activeElement?.key_liter}"]`);
            elements?.forEach((element) => {
                element.classList.add('active');
            });
        }
    }, []);

    useEffect(() => {
        const loadFloor = async () => {
            const floors = await loadFloors(activeElement.key_liter, activeElement.floor);
            setFloors(floors);
        };

        if (activeElement) {
            loadFloor();
        }
    }, [activeElement]);

    const loadFloors = async (buildingId, floor) => {
        if (siteName === 'depo') {
            switch (buildingId) {
                case 'Пр':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/Pr/Floor1'))];
                    break;
                case 'А':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/A/Floor1'))];
                    break;
                case 'Б':
                case 'Пр2':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/B/Floor1'))];
                    break;
                case 'В':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/V/Floor1'))];
                    break;
                case 'Е':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/E/Floor1'))];
                    break;
                case 'П':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/P/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/depo/P/Floor2'))];
                    if (floor === 3) return [React.lazy(() => import('../includes/maps/depo/P/Floor3'))];
                    break;
                case 'Г':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/G/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/depo/G/Floor2'))];
                    break;
                case 'З':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/Z/Floor1'))];
                    break;
                case 'Т':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/T/Floor1'))];
                    break;
                case 'Д':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/depo/D/Floor1'))];
                    break;
                default:
                    return [];
            }
        } else if (siteName === 'gagarinsky') {
            switch (buildingId) {
                case 'А':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/A/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/gagarinsky/A/Floor2'))];
                    if (floor === 3) return [React.lazy(() => import('../includes/maps/gagarinsky/A/Floor3'))];
                    break;
                case 'Б':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/B/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/gagarinsky/B/Floor2'))];
                    break;
                case 'В':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/V/Floor1'))];
                    break;
                case 'Г':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/G/Floor1'))];
                    break;
                case 'Д':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/D/Floor1'))];
                    break;
                case 'Е':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/E/Floor1'))];
                    break;
                case 'Ж':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/J/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/gagarinsky/J/Floor2'))];
                    break;
                case 'З':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/Z/Floor1'))];
                    break;
                case 'К':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/K/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/gagarinsky/K/Floor2'))];
                    break;
                case 'Л':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/L/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/gagarinsky/L/Floor2'))];
                    break;
                case 'Н':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/N/Floor1'))];
                    break;
                case 'П':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/P/Floor1'))];
                    if (floor === 2) return [React.lazy(() => import('../includes/maps/gagarinsky/P/Floor2'))];
                    break;
                case 'С':
                    if (floor === 1) return [React.lazy(() => import('../includes/maps/gagarinsky/S/Floor1'))];
                    break;
                default:
                    return [];
            }
        } else if (siteName === 'yujnaya') {
            switch (buildingId) {
                case 'АПр':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/A_pr2/Floor1'))];
                    break;
                case 'Б':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/B/Floor1'))];
                    break;
                case 'Е':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/E/Floor1'))];
                    break;
                case 'П':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/P/Floor1'))];
                    break;
                case 'Г':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/G/Floor1'))];
                    break;
                case 'Ж':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/J/Floor1'))];
                    if (floor === 2) return [lazy(() => import('../includes/maps/yujnaya/J/Floor2'))];
                    break;
                case 'З':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/Z/Floor1'))];
                    break;
                case 'И':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/I/Floor1'))];
                    break;
                case 'С':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/S/Floor1'))];
                    break;
                case 'Д':
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/D/Floor1'))];
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

    return (
        <div className="scheme">
            <div className="scheme__row">
                <div className="scheme__column">
                    <Suspense fallback={<LoadingSpinner />}>
                        <FloorMap
                            floors={floors}
                            selectedRoomData={{
                                id: activeElement.id,
                                roomCodes: activeElement.room_codes,
                            }}
                        />
                    </Suspense>
                </div>
                <div className="scheme__column">
                    <Suspense fallback={<LoadingSpinner />}>
                        <TerritoryComponent ref={setSvgRef} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Scheme;
