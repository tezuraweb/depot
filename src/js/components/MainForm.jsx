import React, { useState } from 'react';

const MainForm = ({ onSubmit, formData, setFormData }) => {
    const [priceDesc, setPriceDesc] = useState(formData.priceDesc);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, priceDesc });
    };

    const togglePriceOrder = () => {
        setPriceDesc(prevState => !prevState);
        setFormData({
            ...formData,
            priceDesc: !priceDesc
        });
    };

    const generateQueryParams = () => {
        const data = { ...formData, priceDesc };

        return Object.keys(data)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
            .join('&');
    };

    return (
        <form onSubmit={handleSubmit} className="form form--main">
            <div className="form__wrapper">
                <div className="form__group">
                    <label className="form__label">Тип</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="form__input form__input--select">
                        <option value="office">Офисы</option>
                        <option value="industrial">Производственно-складские</option>
                        <option value="commercial">Торговые</option>
                        <option value="land">Участки</option>
                    </select>
                </div>
                <div className="form__group">
                    <label className="form__label">Площадь</label>
                    <select name="area" value={formData.area} onChange={handleChange} className="form__input form__input--select">
                        <option value="area1">до 500</option>
                        <option value="area2">500 - 1000</option>
                        <option value="area3">более 1000</option>
                    </select>
                </div>
                <div className="form__group">
                    <div className="form__group form__group--inline form__group--marginBottom">
                        <label className="form__label form__label--inline">Стоимость</label>
                        <button type="button" onClick={togglePriceOrder} className="form__button--price">
                            <span className={`form__button--arrow ${priceDesc ? 'active' : ''}`}>↓</span>
                            <span className={`form__button--arrow ${priceDesc ? '' : 'active'}`}>↑</span>
                        </button>
                    </div>
                    <div className="form__group form__group--inline">
                        <div className="form__group form__group--inline form__group--marginRight">
                            <label className="form__label form__label--inline">От</label>
                            <input type="number" name="priceFrom" value={formData.priceFrom} onChange={handleChange} className="form__input form__input--number" />
                        </div>
                        <div className="form__group form__group--inline">
                            <label className="form__label form__label--inline">До</label>
                            <input type="number" name="priceTo" value={formData.priceTo} onChange={handleChange} className="form__input form__input--number" />
                        </div>
                    </div>
                </div>

                <div className="form__group form__group--hide">
                    <input type="checkbox" name="promotions" id="promotionCheckbox" checked={formData.promotions} onChange={handleChange} className="form__checkbox" />
                    <label className="form__label" htmlFor="promotionCheckbox">Акции</label>
                </div>
                <button type="submit" className="form__button button button--large animate--pulse">Показать</button>
            </div>

            <a className="form__link" href={`/search?${generateQueryParams()}`}>Расширенный поиск</a>
        </form>
    );
};

export default MainForm;
