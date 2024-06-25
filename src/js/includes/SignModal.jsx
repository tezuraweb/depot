import React, { useState } from 'react';
import axios from 'axios';

const SignModal = ({ doc, onClose }) => {
    const [signType, setSignType] = useState('');
    const [operator, setOperator] = useState('');
    const [message, setMessage] = useState('');

    const handleSignSubmit = () => {
        const data = {
            docId: doc.id,
            signType,
            operator: signType === 'Через ЭДО' ? operator : null
        };
        axios.post('/api/docs/sign', data)
            .then(response => setMessage('Подписание успешно завершено'))
            .catch(error => setMessage('Ошибка при подписании'));
    };

    return (
        <div className="modal">
            <h2>Выбрать способ подписания</h2>
            <button className="animate--pulse" onClick={() => setSignType('Лично')}>Лично</button>
            <button className="animate--pulse" onClick={() => setSignType('Через ЭДО')}>Через ЭДО</button>
            {signType === 'Через ЭДО' && (
                <div>
                    <select onChange={(e) => setOperator(e.target.value)}>
                        <option value="">Укажите оператора</option>
                        <option value="Operator1">Operator1</option>
                        <option value="Operator2">Operator2</option>
                    </select>
                    <button className="animate--pulse" onClick={handleSignSubmit}>Отправить</button>
                </div>
            )}
            {message && <p>{message}</p>}
            <button onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default SignModal;
