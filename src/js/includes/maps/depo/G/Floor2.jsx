import React, { forwardRef } from 'react';

const Floor = forwardRef((props, ref) => (
    <svg ref={ref} {...props} className="icon" xmlns="http://www.w3.org/2000/svg" width="229" height="78" viewBox="0 0 229 78" fill="none">
        <rect width="229" height="78" fill="white" />
        <g id="g-antresole" clip-path="url(#clip0_0_1)">
            <g id="g">
                <rect id="Rectangle 3" x="0.5" y="0.5" width="228" height="77" stroke="black" />
                <rect id="Rectangle 5" x="45" width="184" height="8" fill="#676767" />
                <rect id="Rectangle 6" x="222" y="8" width="7" height="70" fill="#676767" />
                <rect id="Rectangle 7" x="155" y="69" width="74" height="9" fill="#676767" />
                <rect id="Rectangle 8" y="69" width="137" height="9" fill="#676767" />
                <rect id="Rectangle 9" width="9" height="78" fill="#676767" />
                <rect id="Rectangle 10" width="25" height="8" fill="#676767" />
                <rect id="Rectangle 11" x="112" y="27" width="5" height="51" fill="#676767" />
                <rect id="Rectangle 12" x="25" width="20" height="8" fill="#2F3032" />
                <rect id="Rectangle 13" x="112" y="8" width="5" height="23" fill="#2F3032" />
                <rect id="Rectangle 14" x="137" y="69" width="18" height="9" fill="#2F3032" />
            </g>
            <rect className="map__room" data-id="000001411" x="11.5" y="10.5" width="98" height="56" fill="#E1E1E1" stroke="#D40000" stroke-width="5" />
            <rect className="map__room" data-id="000001412" x="119.5" y="10.5" width="100" height="56" fill="#E1E1E1" stroke="#D40000" stroke-width="5" />
        </g>
        <defs>
            <clipPath id="clip0_0_1">
                <rect width="229" height="78" fill="white" />
            </clipPath>
        </defs>
    </svg>
));

export default Floor;