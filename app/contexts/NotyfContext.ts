import { Notyf } from "notyf";
import { createContext } from "react";

export const NotyfContext = createContext<Notyf | null>(null);
