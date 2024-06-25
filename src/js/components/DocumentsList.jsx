import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SignModal from '../includes/SignModal';
import IconSprite from '../includes/IconSprite';

const DocumentsList = () => {
    const [documents, setDocuments] = useState([]);
    const [showSignModal, setShowSignModal] = useState(false);
    const [signingDoc, setSigningDoc] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [failMessage, setFailMessage] = useState(false);

    const docTypes = [
        {
            id: 'act',
            name: 'Акт'
        },
        {
            id: 'spravka',
            name: 'Спарвка'
        },
        {
            id: 'klauza',
            name: 'Кляуза'
        },
    ];

    useEffect(() => {
        axios.get('/api/docs')
            .then(response => setDocuments(response.data))
            .catch(error => console.error('Error fetching documents:', error));
    }, []);

    const handlePrint = (url) => {
        const printWindow = window.open(url, '_blank');
        printWindow.addEventListener('load', () => {
            printWindow.print();
        });
    };

    const handleSign = (doc) => {
        setSigningDoc(doc);
        setShowSignModal(true);
    };

    const handleRequestSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        axios.post('/api/docs/request', formData)
            .then(response => setSuccessMessage(true))
            .catch(error => setFailMessage(true));

        setTimeout(() => {
            setSuccessMessage(false);
            setFailMessage(false);
        }, 5000);
    };

    return (
        <div className="docs">
            <h2 className="docs__title">Договоры</h2>
            <div className="docs__list">
                {documents.filter(doc => doc.type === 'contract').map(doc => (
                    <div className="docs__item" key={doc.id}>
                        <div className="docs__line">
                            <div className="docs__name">{doc.title}</div>
                            <div className="docs__buttons">
                                <button className="docs__button button button--icon button--smallIcon" onClick={() => handlePrint(doc.link)}>
                                <IconSprite
                                        selector="PrinterIcon"
                                        width="18"
                                        height="18"
                                    />
                                </button>
                                <a className="docs__button button button--icon button--smallIcon" href={doc.link} download>
                                    <IconSprite
                                        selector="DownloadIcon"
                                        width="18"
                                        height="18"
                                    />
                                </a>
                                <a className="docs__button button button--icon button--smallIcon" href={doc.link} target='_blank'>
                                    <IconSprite
                                        selector="MagnifierIcon"
                                        width="16"
                                        height="16"
                                    />
                                </a>
                            </div>
                        </div>

                        {!doc.signed && (
                            <div className="docs__line">
                                <button className="button animate--pulse" onClick={() => handleSign(doc)}>Подписать</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="docs__title">Документы</h2>
            <div className="docs__list">
                {documents.filter(doc => doc.type !== 'contract').map(doc => (
                    <div className="docs__item" key={doc.id}>
                        <div className="docs__line">
                            <div className="docs__name">{doc.title}</div>
                            <div className="docs__buttons">
                                <button className="docs__button button button--icon button--smallIcon" onClick={() => handlePrint(doc.link)}>
                                    <IconSprite
                                        selector="PrinterIcon"
                                        width="18"
                                        height="18"
                                    />
                                </button>
                                <a className="docs__button button button--icon button--smallIcon" href={doc.link} download>
                                    <IconSprite
                                        selector="DownloadIcon"
                                        width="18"
                                        height="18"
                                    />
                                </a>
                                <a className="docs__button button button--icon button--smallIcon" href={doc.link} target='_blank'>
                                    <IconSprite
                                        selector="MagnifierIcon"
                                        width="16"
                                        height="16"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="docs__title">Запросить документы</h2>
            <form className="form form--admin" onSubmit={handleRequestSubmit}>
                <div className="form__group">
                    <select className="form__input form__input--black" name="documentType">
                        <option value="" disabled>Выберите документ</option>
                        {docTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form__group">
                    <div className="form__label">Другой запрос</div>
                    <input className="form__input form__input--black" type="text" name="otherRequest" placeholder="Введите название необходимого документа" />
                </div>
                <button className="button animate--pulse" type="submit">Запросить</button>
            </form>
            {successMessage && <div className="docs__message docs__message--green">Запрос успешно отправлен</div>}
            {failMessage && <div className="docs__message docs__message--red">Ошибка отправки запроса</div>}
            {showSignModal && <SignModal doc={signingDoc} onClose={() => setShowSignModal(false)} />}
        </div>
    );
};

export default DocumentsList;
