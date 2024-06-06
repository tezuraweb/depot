import React from 'react';

const IconSprite = ({selector='', width = 12, height = 12, fill = 'none', classNames='Icon-default', ...props}) => {
    return (
        <svg className={`Icon-root Icon-${selector} ${classNames}`} fill={fill} width={width} height={height} {...props}>
            <use xlinkHref={`#${selector}`} />
        </svg>
    );
};

export default IconSprite;
