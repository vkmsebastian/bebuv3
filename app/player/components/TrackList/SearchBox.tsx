import { ListContext } from "@/contexts/ListContext";
import { useContext } from "react";

export default function SearchBox() {
  const { register, handleSearchItemChange } = useContext(ListContext);
  return (
    <div className="h-[10%] mb-1">
      <input
        type="text"
        placeholder="Search songs"
        className="transition-all outline-1 outline-b focus:outline-0 focus:bg-neutral-800 w-[15%] focus:w-[20%] outline-offset-1 outline-gray-300 px-2 py-1 m-2 rounded-md"
        {...(register("search"), { onChange: handleSearchItemChange })}
      />
    </div>
  );
}
