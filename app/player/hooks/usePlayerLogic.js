import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function usePlayerLogic() {
    const router = useRouter();
    const authorizeUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTHORIZE_URL;
    const tokenUrl = process.env.NEXT_PUBLIC_SPOTIFY_TOKEN_URL;
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const playerScript = process.env.NEXT_PUBLIC_SPOTIFY_PLAYER_SCRIPT ?? '';

    const defaultAlbumArt = process.env.NEXT_PUBLIC_PLAYER_DEFAULT_ART ?? '';

    function generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    async function authorize() {
        const scope = 'streaming user-read-email user-read-private';
        const state = generateRandomString(16);
        localStorage.setItem('spotify_auth_state', state);

        const requestParams = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: 'http://localhost:3000/player',
            state: state,
        });

        window.location.href = `${authorizeUrl}${requestParams.toString()}`;
    }

    async function authenticate() {
        const currentUrl = window.location.href;
        const urlParams = new URL(currentUrl).searchParams;
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (state === localStorage.getItem('spotify_auth_state')) {
            try {
                const response = await fetch(tokenUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
                    },
                    body: new URLSearchParams({
                        code: code,
                        redirect_uri: 'http://localhost:3000/player',
                        grant_type: 'authorization_code',
                    }).toString(),
                });

                const data = await response.json();
                console.log('Authorization successful', data);
                localStorage.setItem('spotify_access_token', data.access_token);
                localStorage.setItem('spotify_refresh_token', data.refresh_token);
                router.push('/player');
            } catch (error) {
                console.log('Authentication failed', error);
            }
        } else {
            console.log('State mismatch');
        }
    }

    function getAccessToken() {
        return localStorage.getItem('spotify_access_token');
    }

    async function authorizeClient() {
        authorize();
    }

    useEffect(() => {
        const urlParams = new URL(window.location.href).searchParams;
        if (urlParams.has('code')) {
            authenticate();
        }
    }, []);

    return {
        authorizeClient,
        getAccessToken,

        playerScript,
        defaultAlbumArt,
    };
}
