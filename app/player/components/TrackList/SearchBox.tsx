import { ListContext } from '@/contexts/ListContext';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';

export default function SearchBox() {
    const { register, handleSearchItemChange } = useContext(ListContext);
    return (
        <div className="relative h-[40px] mb-3 items-center">
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <input
                type="text"
                placeholder=""
                className="transition-all duration-150 ease-in-out w-[30px] focus:w-full pl-10 py-2 outline-1 outline-b focus:outline-0 focus:bg-neutral-800 outline-offset-1 outline-gray-300 rounded-full"
                {...register('search', { onChange: handleSearchItemChange })}
            />
        </div>
    );
}
