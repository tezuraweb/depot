import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback, lazy } from 'react';
import LoadingSpinner from '../includes/LoadingSpinner';
import FloorMap from '../includes/maps/FloorMap';

const Scheme = ({ activeElement = null, siteName }) => {
    const [floors, setFloors] = useState([]);
    const svgRef = useRef(null);

    const setSvgRef = useCallback((node) => {
        if (node !== null) {
            svgRef.current = node;
            const element = node.querySelector(`[data-id="${activeElement.key_liter_id}"]`);
            if (element) {
                element.classList.add('active');
            }
        }
    }, []);

    useEffect(() => {
        const loadFloor = async () => {
            const floors = await loadFloors(activeElement.key_liter_id, activeElement.floor);
            setFloors(floors);
        };

        if (activeElement) {
            loadFloor();
        }
    }, [activeElement]);

    const loadFloors = async (buildingId, floor) => {
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
                case 1:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/A_pr2/Floor1'))];
                    break;
                case 14:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/B/Floor1'))];
                    break;
                case 10:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/V/Floor1'))];
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/V/Floor2'))];
                    break;
                case 8:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/E/Floor1'))];
                    break;
                case 7:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/P/Floor1'))];
                    break;
                case 16:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/G/Floor1'))];
                    break;
                case 9:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/Zh/Floor1'))];
                    if (floor === 1) return [lazy(() => import('../includes/maps/yujnaya/Zh/Floor2'))];
                    break;
                case 3:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/Z/Floor1'))];
                    break;
                case 15:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/I/Floor1'))];
                    break;
                case 23:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/S/Floor1'))];
                    break;
                case 5:
                    if (floor === 0) return [lazy(() => import('../includes/maps/yujnaya/D/Floor1'))];
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
                                code: activeElement.kode_text,
                                complex: activeElement.complex_id,
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
