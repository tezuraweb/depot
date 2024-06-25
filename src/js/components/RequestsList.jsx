import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const RequestsList = () => {
    const [requests, setRequests] = useState([]);

    const statusNames = {
        closed: 'Закрыто',
        pending: 'Ожидание',
        active: 'Активно',
    }

    useEffect(() => {
        axios.get('/api/requests')
            .then(response => setRequests(response.data))
            .catch(error => console.error('Error fetching requests:', error));
    }, []);

    return (
        <div className="requests">
            <h2 className="requests__title">Ваши обращения</h2>
            <div className="requests__summary">Создать обращение можно с помощью Telegram-бота, для этого нужно перейти в соответствующий раздел меню и нажать /start. Если по какой-то причине вы не видите эту кнопку, скопируйте команду и введите ее вручную.</div>

            <div className="requests__line">
                <div className="requests__title">История обращений</div>
                <div className="requests__title">Статус</div>
            </div>
            <div className="requests__list">
                {requests.map(request => (
                    <div className="requests__line" key={request.id}>
                        <div className="requests__info">
                            Обращение от {format(new Date(request.date), 'd MMMM yyyy', { locale: ru })} года
                        </div>
                        <div className={`requests__status requests__status--${request.status}`}>{statusNames[request.status]}</div>
                    </div>
                ))}
            </div>
            <div className="requests__desc requests__desc--pending">Ваше обращение находится в очереди на рассмотрение</div>
            <div className="requests__desc requests__desc--active">По вашему обращению есть ответ от менеджера, пожалуйста, проверьте свой телеграм.</div>
            <div className="requests__desc requests__desc--closed">По вашему обращению было принято решение</div>
        </div>
    );
};

export default RequestsList;
