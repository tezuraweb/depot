import React, { forwardRef } from 'react';

const Floor = forwardRef((props, ref) => (
    <svg ref={ref} {...props} className="icon" xmlns="http://www.w3.org/2000/svg" width="467" height="783" viewBox="0 0 467 783" fill="none">
        <g id="liter-i-floor-1" clip-path="url(#clip0_1_9)">
            <path id="liter-i-floor-1_2" d="M5.5 393.5V5.5H461.5V393.5M5.5 393.5H461.5M5.5 393.5V398.5M461.5 393.5V398.5M461.5 398.5V776.5H5.5V398.5M461.5 398.5H5.5M0.5 0.5H467V782.5H0.5V0.5Z" stroke="#1C1D20" />
            <path className="map__room" data-id="000000676" d="M8 391V8H459V391H8Z" fill="#E1E1E1" stroke="#D40000" stroke-width="5" />
            <path className="map__room" data-id="000000677" d="M8 774V401H459V774H8Z" fill="#E1E1E1" stroke="#D40000" stroke-width="5" />
        </g>
        <defs>
            <clipPath id="clip0_1_9">
                <rect width="466.5" height="782" fill="white" transform="translate(0.5 0.5)" />
            </clipPath>
        </defs>
    </svg>
));

export default Floor;