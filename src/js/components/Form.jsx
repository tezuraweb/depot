import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormData, resetFormData } from '../redux/actions/actions';
import axios from 'axios';

import IconSprite from '../includes/IconSprite';
import localization from '../../../assets/json/localization.json';

const LeadForm = ({ afterSubmit, currencies, currentLang, selectedCurrency }) => {
    const services = [
        localization[currentLang].webdevTitle,
        localization[currentLang].smmTitle,
        localization[currentLang].seoTitle,
        localization[currentLang].designTitle,
        localization[currentLang].tgTitle,
        localization[currentLang].analyticsTitle
    ];

    const budgets = {
        'dollar': [
            '$500 - $2000',
            '$2000 - $5000',
            '$5000 - $10000',
            '$10000+',
        ],
        'ruble': [
            '₽30000 - ₽100000',
            '₽100000 - ₽300000',
            '₽300000 - ₽1000000',
            '₽1000000+',
        ],
        'yuan': [
            '¥3000 - ¥8000',
            '¥8000 - ¥20000',
            '¥20000 - ¥50000',
            '¥50000+',
        ],
    };

    const [service, setService] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [messengerId, setMessengerId] = useState('');
    const [messengerType, setMessengerType] = useState('');
    const [budget, setBudget] = useState('');
    const [description, setDescription] = useState('');

    const savedFormState = useSelector((state) => state.form.formData);
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const [usedCurrency, setUsedCurrency] = useState('dollar');

    useEffect(() => {
        setUsedCurrency(currencies[selectedCurrency].name);
    }, [selectedCurrency]);

    useEffect(() => {
        if (savedFormState) {
            setService(typeof savedFormState.service === 'number' ? savedFormState.service : 0);
            setName(savedFormState.name || '');
            setEmail(savedFormState.email || '');
            setMessengerId(savedFormState.messengerId || '');
            setMessengerType(savedFormState.messengerType || '');
            setBudget(savedFormState.budget || '');
            setDescription(savedFormState.description || '');
        }
    }, [savedFormState]);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = { service: services[service], name, email, messengerId, messengerType, budget };

        axios.post('/address', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Submission Successful', response.data);
                dispatch(resetFormData());
                setVisible(false);
                setTimeout(() => {
                    if (afterSubmit) {
                        afterSubmit();
                    }
                }, 300);
            })
            .catch(error => {
                console.error('Submission Error', error);
            });
    };

    const popupClick = (e) => {
        if (e.target != e.currentTarget) return;

        handleClose();
    };

    const handleClose = () => {
        const formData = { service, name, email, messengerId, messengerType, budget, description };
        dispatch(updateFormData(formData));

        setVisible(false);
        setTimeout(() => {
            if (afterSubmit) {
                afterSubmit();
            }
        }, 300);
    };

    const handlePrev = () => {
        const prevInd = service > 0 ? service - 1 : services.length - 1;
        setService(prevInd);
    }

    const handleNext = () => {
        const nextInd = (service + 1) % services.length;
        setService(nextInd);
    }

    return (
        <div className={`form__popup ${visible ? 'active' : ''}`} onClick={(e) => popupClick(e)}>
            <div className="form__container">
                <form className="form__wrapper" onSubmit={handleSubmit}>
                    <div className="form__column form__column--first">
                        <div className="form__line">
                            <input
                                className="form__input"
                                type="text"
                                id="formName"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label className="form__label" htmlFor="formName">{localization[currentLang].formName}</label>
                        </div>

                        <div className="form__line">
                            <input
                                className="form__input"
                                type="email"
                                id="formEmail"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className="form__label" htmlFor="formEmail">{localization[currentLang].formEmail}</label>
                        </div>

                        <div className="form__line">
                            <input
                                className="form__input"
                                type="text"
                                id="formMessengerId"
                                name="messengerId"
                                value={messengerId}
                                onChange={(e) => setMessengerId(e.target.value)}
                            />
                            <label className="form__label" htmlFor="formMessengerId">{localization[currentLang].formMessengerId}</label>
                        </div>

                        <div className="form__line">
                            <div className="form__messengers">
                                <label className="form__radio" htmlFor="formTelegram">
                                    <input
                                        className="form__radio--input"
                                        type="radio"
                                        id="formTelegram"
                                        name="messengerType"
                                        value="telegram"
                                        checked={messengerType === 'telegram'}
                                        onChange={(e) => setMessengerType(e.target.value)}
                                    />
                                    <div className="form__radio--button">
                                        <IconSprite selector="TelegramRoundIcon" width="30" height="30" />
                                    </div>
                                </label>

                                <label className="form__radio" htmlFor="formLine">
                                    <input
                                        className="form__radio--input"
                                        type="radio"
                                        id="formLine"
                                        name="messengerType"
                                        value="line"
                                        checked={messengerType === 'line'}
                                        onChange={(e) => setMessengerType(e.target.value)}
                                    />
                                    <div className="form__radio--button">
                                        <IconSprite selector="LineRoundIcon" width="30" height="30" />
                                    </div>
                                </label>

                                <label className="form__radio" htmlFor="formFb">
                                    <input
                                        className="form__radio--input"
                                        type="radio"
                                        id="formFb"
                                        name="messengerType"
                                        value="fbmessenger"
                                        checked={messengerType === 'fbmessenger'}
                                        onChange={(e) => setMessengerType(e.target.value)}
                                    />
                                    <div className="form__radio--button">
                                        <IconSprite selector="FbRoundIcon" width="30" height="30" />
                                    </div>
                                </label>

                                <label className="form__radio" htmlFor="formWhatsapp">
                                    <input
                                        className="form__radio--input"
                                        type="radio"
                                        id="formWhatsapp"
                                        name="messengerType"
                                        value="whatsapp"
                                        checked={messengerType === 'whatsapp'}
                                        onChange={(e) => setMessengerType(e.target.value)}
                                    />
                                    <div className="form__radio--button">
                                        <IconSprite selector="WhatsappRoundIcon" width="30" height="30" />
                                    </div>
                                </label>

                                <label className="form__radio" htmlFor="formWechat">
                                    <input
                                        className="form__radio--input"
                                        type="radio"
                                        id="formWechat"
                                        name="messengerType"
                                        value="wechat"
                                        checked={messengerType === 'wechat'}
                                        onChange={(e) => setMessengerType(e.target.value)}
                                    />
                                    <div className="form__radio--button">
                                        <IconSprite selector="WechatRoundIcon" width="30" height="30" />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="form__line">
                            <select
                                className="form__input"
                                id="formBudget"
                                name="budget"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            >
                                {budgets[usedCurrency].map((budget) => (
                                    <option value="budget1">{budget}</option>
                                ))}
                            </select>
                            <label className="form__label" htmlFor="formBudget">{localization[currentLang].formBudget}</label>
                        </div>
                        <div className="form__line">
                            <textarea
                                className="form__input"
                                name="description"
                                id="formDesc"
                                cols="30"
                                rows="5"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                            <label className="form__label form__label--small" htmlFor="formDesc">{localization[currentLang].formDesc}</label>
                        </div>
                    </div>

                    <div className="form__column form__column--second">
                        <button className="form__button form__button--upper button" type="button" onClick={() => handleClose()}>x</button>
                        <div className="form__service">
                            <button className="form__service--prev" type="button" onClick={() => handlePrev()}></button>
                            <div className="form__service--text">{services[service]}</div>
                            <button className="form__service--next" type="button" onClick={() => handleNext()}></button>
                        </div>
                        <button className="form__button form__button--lower button" type="submit">//<br />se<br />nd</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadForm;
