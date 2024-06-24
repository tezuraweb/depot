import React, { useState, useEffect } from 'react';

const blocks = [
    {
        id: 1,
        image: '/img/pics/showroom0.webp',
        text: 'Блоки в LIGHT INDUSTRIAL небольшие и начинаются от 100 м², а в среднем составляют 300-1000 м².'
    },
    {
        id: 2,
        image: '/img/pics/showroom1.webp',
        text: 'LIGHT INDUSTRIAL – это качественные производственно-складские помещения для малого и среднего бизнеса с отдельным входом, воротами, выделенной складской зоной и небольшим административным блоком. Высота потолка достигает 6-10 метров.'
    },
    {
        id: 3,
        image: '/img/pics/showroom2.webp',
        text: 'Это единое пространство для размещения легких производств, организации хранения, офиса и шоурума.'
    },
    {
        id: 4,
        image: '/img/pics/showroom3.webp',
        text: 'Заключительный блок с информацией и описанием вашего проекта.'
    }
];

const Presentation = () => {
    const [currentBlock, setCurrentBlock] = useState(0);
    const [direction, setDirection] = useState('forward');

    useEffect(() => {
        const handleScroll = (event) => {
            if (event.deltaY > 0) {
                nextBlock();
            } else {
                previousBlock();
            }
        };
        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [currentBlock]);

    const nextBlock = () => {
        if (direction === 'forward' && currentBlock < blocks.length - 1) {
            setCurrentBlock(currentBlock + 1);
        } else if (direction === 'backward' && currentBlock > 0) {
            setCurrentBlock(currentBlock - 1);
        }
    };

    const previousBlock = () => {
        if (direction === 'forward' && currentBlock > 0) {
            setCurrentBlock(currentBlock - 1);
        } else if (direction === 'backward' && currentBlock < blocks.length - 1) {
            setCurrentBlock(currentBlock + 1);
        }
    };

    useEffect(() => {
        if (currentBlock === blocks.length - 1) {
            setDirection('backward');
        } else if (currentBlock === 0) {
            setDirection('forward');
        }
    }, [currentBlock]);

    return (
        <div className="presentation-container">
            <div className="presentation-block" style={{ backgroundImage: `url(${blocks[currentBlock].image})` }}>
                <div className="presentation-text">
                    {blocks[currentBlock].text}
                </div>
                <div className="presentation-controls">
                    <button onClick={previousBlock} disabled={currentBlock === 0}>&lt;</button>
                    <button onClick={nextBlock} disabled={currentBlock === blocks.length - 1}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default Presentation;
