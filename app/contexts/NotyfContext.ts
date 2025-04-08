import { Notyf } from 'notyf';
import { Oswald } from 'next/font/google';
import { createContext, useEffect, useState } from 'react';

const notyfFont = Oswald({
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
});

export const NotyfContext = createContext({} as ReturnType<typeof useNotyfLogic>);

export function useNotyfLogic() {
    const [notyf, setNotyf] = useState<Notyf | null>(null);

    useEffect(() => {
        const notyfInstance = new Notyf({
            duration: 2000,
            ripple: true,
            position: { x: 'right', y: 'bottom' },
            dismissible: false,
            types: [
                {
                    type: 'success',
                    background: '#212121',
                    className: `text-md ${notyfFont.className}`,
                    icon: false,
                },
                {
                    type: 'error',
                    background: '#F44336',
                    icon: false,
                },
            ],
        });
        setNotyf(notyfInstance);
    }, [notyfFont]);

    return {
        notyf,
        setNotyf,
    };
}
