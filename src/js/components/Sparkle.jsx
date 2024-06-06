import React, { useEffect, useState } from 'react';

import IconSprite from '../includes/IconSprite';

const SparklingBackground = () => {
    const svgData = [
        { id: 'StarIcon1', tagId: 'starSvg1', width: 42, height: 46 },
        { id: 'StarIcon2', tagId: 'starSvg2', width: 40, height: 40 },
        { id: 'StarIcon3', tagId: 'starSvg3', width: 56, height: 56 },
        { id: 'StarIcon4', tagId: 'starSvg4', width: 37, height: 37 },
        { id: 'StarIcon5', tagId: 'starSvg5', width: 73, height: 74 },
        { id: 'StarIcon6', tagId: 'starSvg6', width: 37, height: 47 },
        { id: 'StarIcon7', tagId: 'starSvg7', width: 51, height: 37 },
        { id: 'StarIcon8', tagId: 'starSvg8', width: 58, height: 58 },
        { id: 'StarIcon9', tagId: 'starSvg9', width: 62, height: 43 },
        { id: 'StarIcon10', tagId: 'starSvg10', width: 48, height: 66 },
    ];

    const [svgVisibility, setSvgVisibility] = useState(Array(svgData.length).fill(false));
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const animateSvgGroup = () => {
            setSvgVisibility(Array(svgData.length).fill(false));

            const numberOfSvgsToAnimate = Math.floor(Math.random() * 3) + 1;
            let selectedIndices = new Set();
            while (selectedIndices.size < numberOfSvgsToAnimate) {
                selectedIndices.add(Math.floor(Math.random() * svgData.length));
            }

            setSvgVisibility(svgVisibility.map((_, index) => selectedIndices.has(index)));
            setAnimationKey(prevKey => prevKey + 1);

            setTimeout(animateSvgGroup, 9000);
        };

        animateSvgGroup();

        return () => {
            clearTimeout(animateSvgGroup);
        };
    }, []);

    return (
        <div className="sparkle">
            {svgData.map((data, index) => (
                <IconSprite
                    key={`${data.id}-${animationKey}`}
                    selector={data.id}
                    id={data.tagId}
                    classNames={`star-svg ${svgVisibility[index] ? '' : 'hidden'}`}
                    width={data.width}
                    height={data.height}
                />
            ))}
        </div>
    );
};

export default SparklingBackground;