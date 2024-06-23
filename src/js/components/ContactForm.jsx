import React, { useState } from 'react';
import axios from 'axios';

import IconSprite from '../includes/IconSprite';

const ContactForm = ({ modal, buttonView }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [modalVisible, setModalVisible] = useState(false);

    const popupClick = (e) => {
        if (e.target != e.currentTarget) return;

        setModalVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/contact', formData);
            alert('Заявка отправлена успешно!');
            setFormData({ name: '', phone: '', email: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Ошибка при отправке заявки.');
        }
    };

    return (
        <div>
            {modal && (
                <button className={`button ${buttonView == 'icon' ? 'button--icon' : 'button--large'}`} onClick={() => setModalVisible(true)}>{
                    buttonView == 'icon' ?
                        <IconSprite
                            selector="PhoneSimple"
                            width="26"
                            height="26"
                        /> : 'Закажите звонок'
                }</button>
            )}

            {(!modal || modalVisible) && (
                <div className={modal ? 'modal' : ''} onClick={modal ? (e) => popupClick(e) : null}>
                    <form onSubmit={handleSubmit} className={`form ${modal ? 'modal__content form--modal' : 'form--inline'}`}>
                        {modal && <button className="form__close button button--close" type="button" onClick={() => setModalVisible(false)}></button>}

                        <div className="form__group">
                            <label className="form__label" htmlFor="name">Как к вам обращаться?</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form__input"
                                required
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label" htmlFor="phone">Ваш номер телефона</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form__input"
                                required
                            />
                        </div>
                        <div className="form__group">
                            <label className="form__label" htmlFor="email">Ваш email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form__input"
                                required
                            />
                        </div>
                        <button type="submit" className="form__button button">Отправить</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContactForm;