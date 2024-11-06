import React, { forwardRef } from 'react';

const Territory = forwardRef((props, ref) => (
    <svg ref={ref} {...props} className="icon" xmlns="http://www.w3.org/2000/svg" width="432" height="414" viewBox="0 0 432 414" fill="none">
        <g xmlns="http://www.w3.org/2000/svg">
            <path id="Vector" d="M48.4 293L32.5 269L50.5 80L77 23.5L181.5 69.5L204.5 80L205.5 78L209.5 80L208.5 82L245.5 96L322.5 49.5L335.5 71L340 89L357 116.5L374 107.5L413 177L402.5 299.5L247.5 361L237 346L112 389L48.4 293ZM48.4 293L53 261.5L58 259.5L115.5 224M203.5 152.5L189.5 161.5" stroke="black" stroke-dasharray="2 3" />
            <path className="map__building" data-id="И" d="M344.5 265L295 294L310 321.5L360.5 292.5L344.5 265Z" fill="#E1E1E1" />
            <path className="map__building" data-id="АПр" d="M224 225.5L222 222.5L228 219L230 222L224 225.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="Д" d="M378 108.5L356.5 117.5L387 192L408 183.5L378 108.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="Д" d="M409 184.5L387.5 193L391.5 204L405 199.5L409 184.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="Б" d="M309 112L268 137L278 153L319 128L309 112Z" fill="#E1E1E1" />
            <path className="map__building" data-id="Т" d="M238 164L225.5 170.5L231 181L243.5 174.5L238 164Z" fill="#E1E1E1" />
            <path className="map__building" data-id="П" d="M200.5 88.5L203.5 81.5L212 85.5L208.5 92.5L200.5 88.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="Г" d="M176 141.5L96 190L109 211L188.5 162L176 141.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="А" d="M84 53L46 139L94.5 160.5L99.5 149L94.5 146.5L122.5 83L127.5 85L132.5 74.5L84 53Z" fill="#E1E1E1" />
            <path className="map__building" data-id="В" d="M81.5 50.5L90.5 31L181 71L168 100L131 83.5L135.5 73.5L87.5 52L87 53L81.5 50.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="С" d="M201.5 182.5L189.5 164L110 213L121 231.5L201.5 182.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="Ж" d="M320.5 52.5L192 131.5L204.5 152L333.5 73L320.5 52.5Z" fill="#E1E1E1" />
            <path className="map__building" data-id="З" d="M111.5 230L62 261L77.5 285L127 253L111.5 230Z" fill="#E1E1E1" />
            <path className="map__building" data-id="АПр" d="M335 159L155.5 268L192 329L372 219.5L335 159Z" fill="#E1E1E1" />
            <path className="map__building" data-id="Е" d="M326.5 98.5L340.5 90.5L356 117L342 125.5L326.5 98.5Z" fill="#E1E1E1" />
            <rect className="map__building" data-id="АПр" x="295.013" y="182.369" width="43.3709" height="9.95643" transform="rotate(149 295.013 182.369)" fill="#E1E1E1" />
            <rect className="map__building" data-id="АПр" x="334.624" y="158.549" width="35.5776" height="9.95643" transform="rotate(149 334.624 158.549)" fill="#E1E1E1" />
            <g id="Vector_2">
                <path d="M299.308 157V148.6H306.544V157H305.368V149.332L305.656 149.644H300.196L300.496 149.332V157H299.308Z" fill="black" />
                <path d="M312.344 157.072C311.816 157.072 311.332 156.952 310.892 156.712C310.46 156.464 310.112 156.1 309.848 155.62C309.592 155.14 309.464 154.54 309.464 153.82C309.464 153.1 309.588 152.5 309.836 152.02C310.092 151.54 310.436 151.18 310.868 150.94C311.308 150.7 311.8 150.58 312.344 150.58C312.968 150.58 313.52 150.716 314 150.988C314.48 151.26 314.86 151.64 315.14 152.128C315.42 152.608 315.56 153.172 315.56 153.82C315.56 154.468 315.42 155.036 315.14 155.524C314.86 156.012 314.48 156.392 314 156.664C313.52 156.936 312.968 157.072 312.344 157.072ZM308.972 159.328V150.64H310.076V152.356L310.004 153.832L310.124 155.308V159.328H308.972ZM312.248 156.064C312.656 156.064 313.02 155.972 313.34 155.788C313.668 155.604 313.924 155.344 314.108 155.008C314.3 154.664 314.396 154.268 314.396 153.82C314.396 153.364 314.3 152.972 314.108 152.644C313.924 152.308 313.668 152.048 313.34 151.864C313.02 151.68 312.656 151.588 312.248 151.588C311.848 151.588 311.484 151.68 311.156 151.864C310.836 152.048 310.58 152.308 310.388 152.644C310.204 152.972 310.112 153.364 310.112 153.82C310.112 154.268 310.204 154.664 310.388 155.008C310.58 155.344 310.836 155.604 311.156 155.788C311.484 155.972 311.848 156.064 312.248 156.064Z" fill="black" />
                <path d="M256.308 179V170.6H263.544V179H262.368V171.332L262.656 171.644H257.196L257.496 171.332V179H256.308Z" fill="black" />
                <path d="M269.344 179.072C268.816 179.072 268.332 178.952 267.892 178.712C267.46 178.464 267.112 178.1 266.848 177.62C266.592 177.14 266.464 176.54 266.464 175.82C266.464 175.1 266.588 174.5 266.836 174.02C267.092 173.54 267.436 173.18 267.868 172.94C268.308 172.7 268.8 172.58 269.344 172.58C269.968 172.58 270.52 172.716 271 172.988C271.48 173.26 271.86 173.64 272.14 174.128C272.42 174.608 272.56 175.172 272.56 175.82C272.56 176.468 272.42 177.036 272.14 177.524C271.86 178.012 271.48 178.392 271 178.664C270.52 178.936 269.968 179.072 269.344 179.072ZM265.972 181.328V172.64H267.076V174.356L267.004 175.832L267.124 177.308V181.328H265.972ZM269.248 178.064C269.656 178.064 270.02 177.972 270.34 177.788C270.668 177.604 270.924 177.344 271.108 177.008C271.3 176.664 271.396 176.268 271.396 175.82C271.396 175.364 271.3 174.972 271.108 174.644C270.924 174.308 270.668 174.048 270.34 173.864C270.02 173.68 269.656 173.588 269.248 173.588C268.848 173.588 268.484 173.68 268.156 173.864C267.836 174.048 267.58 174.308 267.388 174.644C267.204 174.972 267.112 175.364 267.112 175.82C267.112 176.268 267.204 176.664 267.388 177.008C267.58 177.344 267.836 177.604 268.156 177.788C268.484 177.972 268.848 178.064 269.248 178.064Z" fill="black" />
                <path d="M274.781 179V171.08L275.297 171.644H272.885V170.6H275.969V179H274.781Z" fill="black" />
                <path d="M218.284 219.944C218.7 220.096 219.084 220.136 219.436 220.064C219.788 219.984 220.104 219.716 220.384 219.26L220.792 218.612L220.912 218.48L223.996 212.6H225.184L221.452 219.512C221.172 220.04 220.844 220.44 220.468 220.712C220.1 220.976 219.7 221.12 219.268 221.144C218.844 221.176 218.412 221.096 217.972 220.904L218.284 219.944ZM220.876 219.548L217.192 212.6H218.476L221.536 218.588L220.876 219.548Z" fill="black" />
                <path d="M263.144 248L266.948 239.6H268.136L271.952 248H270.692L267.296 240.272H267.776L264.38 248H263.144ZM264.764 245.9L265.088 244.94H269.816L270.164 245.9H264.764Z" fill="black" />
                <path d="M396.888 214.436V207.644H393.204L393.144 209.408C393.12 210 393.08 210.568 393.024 211.112C392.976 211.656 392.904 212.148 392.808 212.588C392.712 213.02 392.576 213.376 392.4 213.656C392.232 213.936 392.016 214.108 391.752 214.172L390.456 213.956C390.768 213.98 391.024 213.876 391.224 213.644C391.432 213.404 391.592 213.072 391.704 212.648C391.824 212.216 391.912 211.716 391.968 211.148C392.024 210.572 392.064 209.956 392.088 209.3L392.172 206.6H398.076V214.436H396.888ZM390.156 216.836L390.168 213.956H399.312V216.836H398.196V215H391.284L391.272 216.836H390.156Z" fill="black" />
                <path d="M401.637 215V207.08L402.153 207.644H399.741V206.6H402.825V215H401.637Z" fill="black" />
                <path d="M385.888 154.436V147.644H382.204L382.144 149.408C382.12 150 382.08 150.568 382.024 151.112C381.976 151.656 381.904 152.148 381.808 152.588C381.712 153.02 381.576 153.376 381.4 153.656C381.232 153.936 381.016 154.108 380.752 154.172L379.456 153.956C379.768 153.98 380.024 153.876 380.224 153.644C380.432 153.404 380.592 153.072 380.704 152.648C380.824 152.216 380.912 151.716 380.968 151.148C381.024 150.572 381.064 149.956 381.088 149.3L381.172 146.6H387.076V154.436H385.888ZM379.156 156.836L379.168 153.956H388.312V156.836H387.196V155H380.284L380.272 156.836H379.156Z" fill="black" />
                <path d="M339.4 108.224H343.72V109.244H339.4V108.224ZM339.508 111.956H344.404V113H338.308V104.6H344.236V105.644H339.508V111.956Z" fill="black" />
                <path d="M219.024 174V166.332L219.324 166.644H216.156V165.6H223.08V166.644H219.912L220.2 166.332V174H219.024Z" fill="black" />
                <path d="M266.716 108L264.088 103.86L265.096 103.26L268.12 108H266.716ZM262.408 104.304V103.248H264.868V104.304H262.408ZM265.168 103.932L264.052 103.764L266.632 99.6H267.916L265.168 103.932ZM257.632 108H256.228L259.24 103.26L260.26 103.86L257.632 108ZM262.768 108H261.592V99.6H262.768V108ZM261.952 104.304H259.48V103.248H261.952V104.304ZM259.192 103.932L256.432 99.6H257.716L260.284 103.764L259.192 103.932Z" fill="black" />
                <path d="M155.064 200.096C154.424 200.096 153.832 199.992 153.288 199.784C152.752 199.568 152.284 199.268 151.884 198.884C151.492 198.492 151.184 198.036 150.96 197.516C150.736 196.996 150.624 196.424 150.624 195.8C150.624 195.176 150.736 194.604 150.96 194.084C151.184 193.564 151.496 193.112 151.896 192.728C152.296 192.336 152.764 192.036 153.3 191.828C153.844 191.612 154.436 191.504 155.076 191.504C155.724 191.504 156.32 191.616 156.864 191.84C157.416 192.056 157.884 192.38 158.268 192.812L157.488 193.568C157.168 193.232 156.808 192.984 156.408 192.824C156.008 192.656 155.58 192.572 155.124 192.572C154.652 192.572 154.212 192.652 153.804 192.812C153.404 192.972 153.056 193.196 152.76 193.484C152.464 193.772 152.232 194.116 152.064 194.516C151.904 194.908 151.824 195.336 151.824 195.8C151.824 196.264 151.904 196.696 152.064 197.096C152.232 197.488 152.464 197.828 152.76 198.116C153.056 198.404 153.404 198.628 153.804 198.788C154.212 198.948 154.652 199.028 155.124 199.028C155.58 199.028 156.008 198.948 156.408 198.788C156.808 198.62 157.168 198.364 157.488 198.02L158.268 198.776C157.884 199.208 157.416 199.536 156.864 199.76C156.32 199.984 155.72 200.096 155.064 200.096Z" fill="black" />
                <path d="M87.144 108L90.948 99.6H92.136L95.952 108H94.692L91.296 100.272H91.776L88.38 108H87.144ZM88.764 105.9L89.088 104.94H93.816L94.164 105.9H88.764Z" fill="black" />
                <path d="M324.308 297V288.6H325.496V295.08L330.464 288.6H331.568V297H330.392V290.532L325.412 297H324.308Z" fill="black" />
                <path d="M137.308 183V174.6H142.816L142.804 175.644H138.196L138.484 175.344L138.496 183H137.308Z" fill="black" />
                <path d="M189.308 91V82.6H196.544V91H195.368V83.332L195.656 83.644H190.196L190.496 83.332V91H189.308Z" fill="black" />
                <path d="M150.308 78V69.6H153.92C154.832 69.6 155.548 69.784 156.068 70.152C156.588 70.52 156.848 71.056 156.848 71.76C156.848 72.448 156.6 72.976 156.104 73.344C155.608 73.704 154.956 73.884 154.148 73.884L154.364 73.524C155.3 73.524 156.016 73.712 156.512 74.088C157.016 74.456 157.268 74.996 157.268 75.708C157.268 76.428 157.004 76.992 156.476 77.4C155.956 77.8 155.18 78 154.148 78H150.308ZM151.496 77.052H154.124C154.764 77.052 155.244 76.936 155.564 76.704C155.892 76.464 156.056 76.1 156.056 75.612C156.056 75.124 155.892 74.768 155.564 74.544C155.244 74.32 154.764 74.208 154.124 74.208H151.496V77.052ZM151.496 73.296H153.836C154.42 73.296 154.864 73.18 155.168 72.948C155.48 72.716 155.636 72.376 155.636 71.928C155.636 71.472 155.48 71.128 155.168 70.896C154.864 70.664 154.42 70.548 153.836 70.548H151.496V73.296Z" fill="black" />
                <path d="M90.384 261.088L90.804 260.2C91.172 260.488 91.576 260.704 92.016 260.848C92.464 260.992 92.908 261.068 93.348 261.076C93.788 261.076 94.192 261.016 94.56 260.896C94.936 260.776 95.236 260.596 95.46 260.356C95.684 260.116 95.796 259.82 95.796 259.468C95.796 259.036 95.62 258.708 95.268 258.484C94.924 258.26 94.444 258.148 93.828 258.148H91.956V257.176H93.744C94.28 257.176 94.696 257.068 94.992 256.852C95.296 256.628 95.448 256.32 95.448 255.928C95.448 255.632 95.356 255.384 95.172 255.184C94.996 254.976 94.752 254.82 94.44 254.716C94.136 254.612 93.788 254.56 93.396 254.56C93.012 254.552 92.616 254.604 92.208 254.716C91.8 254.82 91.408 254.988 91.032 255.22L90.648 254.236C91.16 253.948 91.692 253.748 92.244 253.636C92.804 253.516 93.344 253.48 93.864 253.528C94.384 253.568 94.852 253.688 95.268 253.888C95.692 254.08 96.028 254.336 96.276 254.656C96.532 254.968 96.66 255.344 96.66 255.784C96.66 256.184 96.556 256.54 96.348 256.852C96.14 257.156 95.852 257.392 95.484 257.56C95.116 257.72 94.688 257.8 94.2 257.8L94.248 257.476C94.808 257.476 95.292 257.568 95.7 257.752C96.116 257.928 96.436 258.18 96.66 258.508C96.892 258.836 97.008 259.216 97.008 259.648C97.008 260.056 96.904 260.42 96.696 260.74C96.488 261.052 96.204 261.316 95.844 261.532C95.492 261.74 95.088 261.892 94.632 261.988C94.184 262.084 93.712 262.116 93.216 262.084C92.72 262.052 92.228 261.956 91.74 261.796C91.26 261.636 90.808 261.4 90.384 261.088Z" fill="black" />
                <path d="M290.308 137V128.6H296.644V129.62H291.496V132.02H294.112C295.112 132.02 295.872 132.228 296.392 132.644C296.912 133.06 297.172 133.664 297.172 134.456C297.172 135.272 296.888 135.9 296.32 136.34C295.76 136.78 294.956 137 293.908 137H290.308ZM291.496 136.052H293.86C294.556 136.052 295.08 135.92 295.432 135.656C295.792 135.392 295.972 135 295.972 134.48C295.972 133.472 295.268 132.968 293.86 132.968H291.496V136.052Z" fill="black" />
            </g>
        </g>
    </svg>
));

export default Territory;