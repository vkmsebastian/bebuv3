import Image from 'next/image';

export default function AlbumItem({ album, handler }) {
    return (
        <button
            key={album?.uri}
            className="w-full relative mb-2 flex flex-row gap-2 hover:outline-1"
            onClick={() => handler({ context_uri: album?.uri })}
        >
            <Image draggable={false} src={album?.images[0]?.url} alt="Album Art" width={45} height={45} />
            <div>
                <p className="select-none text-nowrap overflow-hidden">{album?.name}</p>
                <p className="text-xs select-none">{album?.artists.map((artist) => artist?.name).join(', ')}</p>
            </div>
        </button>
    );
}
