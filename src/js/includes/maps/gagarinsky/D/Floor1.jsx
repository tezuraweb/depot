

import React, { forwardRef } from 'react';

const Floor = forwardRef((props, ref) => (
    <svg ref={ref} {...props} className="icon" xmlns="http://www.w3.org/2000/svg" width="1114" height="1355" viewBox="0 0 1114 1355" fill="none">
        <rect width="1114" height="1355" fill="#F5F5F5" />
        <g id="d-1" clip-path="url(#clip0_0_1)">
            <g id="Vector">
                <path d="M342 1282H786V1355H342V1282Z" fill="#2F3032" />
                <path d="M0 3H70V1355H0V3Z" fill="#9B9B9B" />
                <path d="M0 1282H342V1355H0V1282Z" fill="#999898" />
                <path d="M786 1282H1114V1355H786V1282Z" fill="#9F9F9F" />
                <path d="M1051 3H1114V1355H1051V3Z" fill="#9F9F9F" />
                <path d="M1001 3H1114V60H1001V3Z" fill="#FFF8D3" />
                <path d="M538 3H617V60H538V3Z" fill="#FFF8D3" />
                <path d="M0 3H150V60H0V3Z" fill="#FFF8D3" />
                <path d="M617 3H1001V60H617V3Z" fill="#676767" />
                <path d="M150 0H538V60H150V0Z" fill="#676767" />
            </g>
            <rect className="map__room" data-id="000001401" x="80" y="70" width="961" height="1202" fill="#E1E1E1" stroke="#D40000" stroke-width="20" />
        </g>
        <defs>
            <clipPath id="clip0_0_1">
                <rect width="1114" height="1355" fill="white" />
            </clipPath>
        </defs>
    </svg>
));

export default Floor;