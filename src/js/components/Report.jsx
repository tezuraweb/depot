import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconSprite from '../includes/IconSprite';

const Report = () => {
    const [calculatedData, setCalculatedData] = useState({
        quantityRoomsSum: 0,
        forRentSum: 0,
        vacantPremisesSum: 0,
        rentalFlowSum: 0,
        potentialrentalFlowSum: 0,
        averagePriceAvg: 0,
        percentforRentAvg: 0,
        percentvacantPremisesAvg: 0
    });
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = '/api/report';
                const response = await axios.get(url);
                if (response.data?.length > 0) {
                    const reportData = response.data;

                    const quantityRoomsSum = reportData.reduce((acc, item) => {
                        return acc + (item?.quantityRomms || 0);
                    }, 0);

                    const forRentSum = reportData.reduce((acc, item) => {
                        return acc + (item?.forRent || 0);
                    }, 0);

                    const vacantPremisesSum = reportData.reduce((acc, item) => {
                        return acc + (item?.vacantPremises || 0);
                    }, 0);

                    const rentalFlowSum = reportData.reduce((acc, item) => {
                        return acc + (item?.rentalFlow || 0);
                    }, 0);

                    const potentialrentalFlowSum = reportData.reduce((acc, item) => {
                        return acc + (item?.potentialrentalFlow || 0);
                    }, 0);

                    const averagePriceAvg = Math.round(reportData.reduce((acc, item) => {
                        return acc + (item?.quantityRomms * item?.averagePrice || 0);
                    }, 0) / quantityRoomsSum);

                    const percentforRentAvg = Math.round(reportData.reduce((acc, item) => {
                        return acc + (item?.forRent * item?.percentforRent || 0);
                    }, 0) / forRentSum);

                    const percentvacantPremisesAvg = Math.round(reportData.reduce((acc, item) => {
                        return acc + (item?.vacantPremises * item?.percentvacantPremises || 0);
                    }, 0) / vacantPremisesSum);

                    setData(reportData);
                    setCalculatedData({
                        quantityRoomsSum,
                        forRentSum,
                        vacantPremisesSum,
                        rentalFlowSum,
                        potentialrentalFlowSum,
                        averagePriceAvg: isNaN(averagePriceAvg) ? 0 : averagePriceAvg,
                        percentforRentAvg: isNaN(percentforRentAvg) ? 0 : percentforRentAvg,
                        percentvacantPremisesAvg: isNaN(percentvacantPremisesAvg) ? 0 : percentvacantPremisesAvg,
                    });
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        fetchData();
    }, []);

    const getIconName = (type) => {
        switch (type) {
            case 'Торговое':
                return 'CommercialPremises';
            case 'Холодный склад':
                return 'RefrigeratorPremises';
            case 'Производственно-складское':
                return 'WarehousePremises';
            case 'Офис':
                return 'OfficePremises';
            case 'Земельный участок':
                return 'SitePremises';
            default:
                return '';
        }
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="report">
            <div className="report__header">
                <div className="report__title">
                    <h1 className="report__h1">АО “Депо”</h1>
                    <h2 className="report__h2">Отчет данных аренды</h2>
                </div>
                <div className="report__date">
                    <p>Дата формирования отчета: <br /> {new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button className="report__print button button--icon" onClick={handlePrint}>
                    <IconSprite
                        selector="PrinterIcon"
                        width="30"
                        height="30"
                    />
                </button>
            </div>

            <div className="report__group">
                <div className="report__column">
                    <div className="report__status">
                        <h3 className="report__h3">Показатели помещений</h3>
                        {data.map((type) => (
                            <div className="report__block" key={type.typeRooms}>
                                <div className="report__metrics report__metrics--sb">
                                    <h4 className="report__h4">
                                        <div className="report__icon">
                                            <IconSprite
                                                selector={getIconName(type.typeRooms)}
                                                width="30"
                                                height="30"
                                            />
                                        </div>
                                        <span>{type.typeRooms}</span>
                                    </h4>
                                    <div className="report__metric">
                                        {type.quantityRomms} <span className="report__metric--thin">позиций</span>
                                    </div>
                                </div>
                                <div className="report__bar">
                                    <div className="report__percentage report__percentage--green" style={{ width: `${type.percent}%` }}>{type.percent}%</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="report__ratio">
                        <div className="report__stats">
                            <div className="report__stat">
                                <div>Общее количество помещений</div>
                                <div>{calculatedData.quantityRoomsSum}</div>
                            </div>
                            <div className="report__stat">
                                <div>Средняя стоимость кв/м (Аренда)</div>
                                <div>{calculatedData.averagePriceAvg}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="report__column">
                    <div className="report__status">
                        <h3 className="report__h3">Помещения в аренде</h3>
                        {data.map((type) => (
                            <div className="report__block" key={type.typeRooms}>
                                <div className="report__metrics report__metrics--sb">
                                    <h4 className="report__h4">
                                        <div className="report__icon">
                                            <IconSprite
                                                selector={getIconName(type.typeRooms)}
                                                width="30"
                                                height="30"
                                            />
                                        </div>
                                        <span>{type.typeRooms}</span>
                                    </h4>
                                    <div className="report__metric">
                                        {type.forRent} <span className="report__metric--thin">арендовано из {type.quantityRomms}</span>
                                    </div>
                                </div>
                                <div className="report__bar">
                                    <div className="report__percentage report__percentage--green" style={{ width: `${type.percentforRent}%` }}>{type.percentforRent}%</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="report__ratio">
                        <div className="report__stats">
                            <div className="report__stat">
                                <div>Всего помещений в аренде</div>
                                <div>{calculatedData.forRentSum}</div>
                            </div>
                            <div className={`
                                report__stat
                                ${calculatedData.percentforRentAvg >= 90 ? 'report__stat--green' :
                                    (calculatedData.percentforRentAvg >= 50 ? 'report__stat--yellow' : 'report__stat--red')
                                }
                            `}>
                                <div>Конверсия аредны</div>
                                <div>{calculatedData.percentforRentAvg}%</div>
                            </div>
                            <div className="report__stat report__stat--grey">
                                <div>Помещений свободно</div>
                                <div>{calculatedData.vacantPremisesSum} ({calculatedData.percentvacantPremisesAvg}%)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {data.map((type) => (
                    <div className="report__column">
                        <div className="report__status">
                            <div className="report__block" key={type.typeRooms}>
                                <h4 className="report__h4">
                                    <div className="report__icon">
                                        <IconSprite
                                            selector={getIconName(type.typeRooms)}
                                            width="30"
                                            height="30"
                                        />
                                    </div>
                                    <span>{type.typeRooms}</span>
                                </h4>
                                <div className="report__metrics report__metrics--sb">
                                    <div className="report__metric">
                                        <span className="report__metric--thin">В аренде </span>{type.forRent}
                                    </div>
                                    <div className="report__metric">
                                        <span className="report__metric--thin">Свободно </span>{type.vacantPremises}
                                    </div>
                                </div>
                                <div className="report__bar">
                                    <div className="report__percentage report__percentage--green" style={{ width: `${type.percentforRent}%` }}>{type.percentforRent}%</div>
                                    <div className="report__percentage" style={{ width: `${type.percentvacantPremises}%` }}>{type.percentvacantPremises}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="report__ratio">
                            <div className="report__stats">
                                <div className="report__stat">
                                    <div>Средняя стоимость кв/м (Аренда) </div>
                                    <div>{type.averagePrice}</div>
                                </div>
                                <div className={`
                                    report__stat
                                    ${calculatedData.percentforRent >= 90 ? 'report__stat--green' :
                                        (type.percentforRent >= 50 ? 'report__stat--yellow' : 'report__stat--red')
                                    }
                                `}>
                                    <div>Конверсия аредны</div>
                                    <div>{type.percentforRent}%</div>
                                </div>
                                <div className="report__stat report__stat--blue">
                                    <div>Арендный поток</div>
                                    <div>{type.rentalFlow} руб.</div>
                                </div>
                                <div className="report__stat report__stat--grey">
                                    <div>Потенциальный арендный поток</div>
                                    <div>{type.potentialrentalFlow} руб.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="report__summary">
                <h3 className="report__h3">Финансовая информация</h3>
                <div className="report__metrics">
                    <div className="report__metric">
                        <p>Арендный поток в месяц</p>
                        <p className="report__metric--large">{calculatedData.rentalFlowSum} руб.</p>
                    </div>
                    <div className="report__metric">
                        <p>Потенциальный арендный поток со свободных помещений</p>
                        <p className="report__metric--large">{calculatedData.potentialrentalFlowSum} руб.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
