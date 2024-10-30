type WindowSize = {
    windowWidth: number;
    windowHeight: number;
}

import { useState, useEffect } from 'react';

export function useWindowSize(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    })

    useEffect(() => {
        const resize = () => {
            setWindowSize({
                windowWidth: window.outerWidth,
                windowHeight: window.outerHeight
            })
        }
        window.addEventListener('resize', resize);

        return() => {
            window.removeEventListener('resize', resize);
        }
    },[]);
    return windowSize;
}