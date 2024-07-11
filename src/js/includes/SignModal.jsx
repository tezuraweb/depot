import React, { useState } from 'react';
import axios from 'axios';
import IconSprite from './IconSprite';

const SignModal = ({ doc, onClose }) => {
    const [signED, setSignED] = useState(false);
    const [operator, setOperator] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);

    const handlePersonalClick = () => {
        setSignED(false);
        handleSignSubmit();
    };

    const handleSignSubmit = () => {
        const data = {
            docId: doc.id,
            signType: signED ? 'Через ЭДО' : 'Лично',
            operator: signED ? operator : null
        };
        axios.post('/api/docs/sign', data)
            .then(response => setSuccessMessage(true))
            .catch(error => setFailMessage(true));

        setTimeout(() => {
            setSuccessMessage(false);
            setFailMessage(false);
        }, 5000);
    };

    return (
        <div className="editor__popup">
            <div className="editor__popup--content">
                <div className="editor__popup--header flex flex--sb flex--center">
                    <h2 className="editor__title">Выбрать способ подписания</h2>
                    <button className="editor__close" onClick={onClose} aria-label="Закрыть">
                        <IconSprite
                            selector="CloseIcon"
                            width="30"
                            height="30"
                        />
                    </button>
                </div>

                <div className="editor__popup--buttons">
                    <button className="button animate--pulse" onClick={handlePersonalClick}>Лично</button>
                    <button className="button animate--pulse" onClick={() => setSignED(true)}>Через ЭДО</button>
                </div>

                {signED && (
                    <div className="form form--admin">
                        <div className="form__group">
                            <select className="form__input" onChange={(e) => setOperator(e.target.value)}>
                                <option value="">Укажите оператора</option>
                                <option value="Operator1">Тензор(СБИС)</option>
                                <option value="Operator2">Вариантий 2</option>
                            </select>
                        </div>
                        <button className="button animate--pulse" onClick={handleSignSubmit}>Отправить</button>
                    </div>
                )}
                {successMessage && <div className="editor__message editor__message--green">Запрос на подписание отправлен</div>}
                {failMessage && <div className="editor__message editor__message--red">Ошибка отправки запроса</div>}
            </div>
        </div>
    );
};

export default SignModal;
