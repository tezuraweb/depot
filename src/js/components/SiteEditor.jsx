import React, { useState, useEffect } from 'react';
import axios from 'axios';
import usePhotoManager from '../utils/usePhotoManager';

const SiteEditor = () => {
    const { uploadPhoto } = usePhotoManager();
    const [managerData, setManagerData] = useState({
        name: '',
        text: '',
        photo: ''
    });
    const [managerSuccessMessage, setManagerSuccessMessage] = useState('');
    const [managerFailMessage, setManagerFailMessage] = useState('');

    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState('');
    const [tenantData, setTenantData] = useState({
        id: -1,
        title: '',
        link: '',
        text: '',
        logo: '',
    });
    const [tenantPhoto, setTenantPhoto] = useState('');
    const [tenantSuccessMessage, setTenantSuccessMessage] = useState('');
    const [tenantFailMessage, setTenantFailMessage] = useState('');
    const [tenantPhotoSuccessMessage, setTenantPhotoSuccessMessage] = useState('');
    const [tenantPhotoFailMessage, setTenantPhotoFailMessage] = useState('');

    useEffect(() => {
        fetchManager();
        fetchTenants();
    }, []);

    const fetchManager = () => {
        axios.get('/api/manager')
            .then(response => setManagerData(response.data))
            .catch(error => console.error('Error fetching manager data:', error));
    };

    const fetchTenants = () => {
        axios.get('/api/residents/backoffice')
            .then(response => setTenants(response.data))
            .catch(error => console.error('Error fetching residents list:', error));
    };

    const handleManagerChange = (e) => {
        const { name, value } = e.target;
        setManagerData({ ...managerData, [name]: value });
    };

    const handleTenantChange = (e) => {
        const { name, value } = e.target;
        setTenantData({ ...tenantData, [name]: value });
    };

    const handleTenantSelect = (e) => {
        const tenantInd = e.target.value;
        setSelectedTenant(tenantInd);
        if (tenantInd === '') {
            setTenantData({ id: '', title: '', link: '', text: '', logo: '' });
        } else {
            const selected = tenants[tenantInd];
            setTenantData(selected);
        }
    };

    const handleManagerSubmit = async (e) => {
        e.preventDefault();
        try {
            if (managerData.photoFile) {
                const photoUrl = await uploadPhoto(managerData.photoFile, 'manager');
                setManagerData(prevData => ({ ...prevData, photo: photoUrl }));
            }//переделать чтобы обновлялся managerdata
            await axios.post('/api/manager/update', managerData);
            showMessage('Данные успешно сохранены', setManagerSuccessMessage);
        } catch (error) {
            showMessage(`Ошибка при сохранении данных: ${error.message}`, setManagerFailMessage);
        }
    };

    const handleTenantSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTenant === '') {
                const formData = {
                    title: tenantData.title,
                    link: tenantData.link,
                    text: tenantData.text,
                }
                await axios.put('/api/residents/create', formData);
            } else {
                const formData = {
                    id: tenantData.id,
                    title: tenantData.title,
                    link: tenantData.link,
                    text: tenantData.text,
                }
                await axios.post('/api/residents/update', formData);
            }
            showMessage('Данные успешно сохранены', setTenantSuccessMessage);
            setTenantData({ id: '', title: '', link: '', text: '', logo: '' });
            setSelectedTenant('');
            fetchTenants();
        } catch (error) {
            showMessage(error.message, setTenantFailMessage);
        }
    };

    const handleTenantDelete = async () => {
        if (selectedTenant === '') return;
        try {
            await axios.delete('/api/photo', {
                data: { id: tenantData.id, photoUrl: tenantData.logo, model: 'residents' }
            });
        } catch (error) {
            console.log('не найден файл для удаления', error.message)
        }
        try {
            await axios.delete(`/api/residents/delete/${tenantData.id}`);
            showMessage('Данные успешно удалены', setTenantSuccessMessage);
            setTenantData({ id: '', title: '', link: '', text: '', logo: '' });
            setSelectedTenant('');
            fetchTenants();
        } catch (error) {
            showMessage('Ошибка при удалении данных', setTenantFailMessage);
        }
    };

    const handlePhotoChange = (e, setData) => {
        const file = e.target.files[0];
        if (!file) return;
        setData(file);
    };

    const handleTenantPhotoSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedTenant && tenantData.id && tenantPhoto) {
                await uploadPhoto(tenantPhoto, tenantData.id, 'residents');
            }

            showMessage('Фото успешно обновлено', setTenantPhotoSuccessMessage);
            fetchTenants();
        } catch (error) {
            showMessage(error.message, setTenantPhotoFailMessage);
        }
    };

    const showMessage = (message, msgSetter) => {
        msgSetter(message);
        setTimeout(() => {
            msgSetter('');
        }, 5000);
    }

    return (
        <div className="editor">
            <div className="editor__block">
                <h2 className="editor__title">Блок Управляющий</h2>
                <form className="form form--admin" onSubmit={handleManagerSubmit}>
                    <div className="form__group">
                        <label className="form__label">Изменить ФИО</label>
                        <input
                            className="form__input form__input--black"
                            type="text"
                            name="name"
                            value={managerData.name}
                            onChange={handleManagerChange}
                            placeholder="Введите ФИО"
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить текст</label>
                        <textarea
                            className="form__input form__input--black"
                            name="text"
                            rows="5"
                            value={managerData.text}
                            onChange={handleManagerChange}
                            placeholder="Введите текст"
                        ></textarea>
                    </div>
                    {/* <div className="form__group">
                        <label className="form__label">Изменить фотографию</label>
                        <input
                            className="form__input form__input--black"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(e, setManagerData)}
                        />
                    </div> */}
                    <button className="button animate--pulse" type="submit">Сохранить</button>
                    {managerSuccessMessage && <div className="editor__message editor__message--green">{managerSuccessMessage}</div>}
                    {managerFailMessage && <div className="editor__message editor__message--red">{managerFailMessage}</div>}
                </form>
            </div>

            <div className="editor__block">
                <h2 className="editor__title">Блок Арендаторы</h2>
                <form className="form form--admin" onSubmit={handleTenantSubmit}>
                    <div className="form__group">
                        <label className="form__label">Выбрать арендатора</label>
                        <select
                            className="form__input form__input--black"
                            value={selectedTenant}
                            onChange={handleTenantSelect}
                        >
                            <option value="">Не выбрано</option>
                            {tenants.map((tenant, index) => (
                                <option key={index} value={index}>{tenant.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить заголовок</label>
                        <input
                            className="form__input form__input--black"
                            type="text"
                            name="title"
                            value={tenantData.title}
                            onChange={handleTenantChange}
                            placeholder="Введите заголовок"
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить ссылку</label>
                        <input
                            className="form__input form__input--black"
                            type="text"
                            name="link"
                            value={tenantData.link}
                            onChange={handleTenantChange}
                            placeholder="Введите ссылку"
                        />
                    </div>
                    <div className="form__group">
                        <label className="form__label">Изменить текст</label>
                        <textarea
                            className="form__input form__input--black"
                            name="text"
                            rows="5"
                            value={tenantData.text}
                            onChange={handleTenantChange}
                            placeholder="Введите текст"
                        ></textarea>
                    </div>

                    <div className="flex flex--sb">
                        <button className="button animate--pulse" type="submit">Сохранить</button>
                        <button
                            className="button button--grey animate--pulse"
                            type="button"
                            onClick={handleTenantDelete}
                        >
                            Удалить
                        </button>
                    </div>

                    {tenantSuccessMessage && <div className="editor__message editor__message--green">{tenantSuccessMessage}</div>}
                    {tenantFailMessage && <div className="editor__message editor__message--red">{tenantFailMessage}</div>}
                </form>
            </div>

            <div className="editor__block">
                <form className="form form--small" onSubmit={handleTenantPhotoSubmit}>
                    <div className="form__group">
                        <label className="form__label">Изменить фотографию</label>
                        <input
                            className="form__input form__input--black"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoChange(e, setTenantPhoto)}
                            disabled={selectedTenant === '' ? true : false}
                        />
                    </div>

                    <button
                        type="submit"
                        className="form__button button"
                        disabled={selectedTenant === '' ? true : false}
                    >
                        Сохранить
                    </button>
                    {tenantPhotoFailMessage && <div className="form__message form__message--red">{tenantPhotoFailMessage}</div>}
                    {tenantPhotoSuccessMessage && <div className="form__message form__message--green">{tenantPhotoSuccessMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default SiteEditor;
