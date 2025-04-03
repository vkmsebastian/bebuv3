'use client';
import usePlayerLogic from './hooks/usePlayerLogic';

export default function Player() {
    const { authorizeClient } = usePlayerLogic();
    return (
        <div>
            <p>Player</p>
            <button onClick={authorizeClient}>Authorize</button>
        </div>
    );
}
