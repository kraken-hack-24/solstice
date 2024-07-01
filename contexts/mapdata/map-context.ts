import { Property } from '@/app/models/property.model';
import { createContext, Dispatch, SetStateAction } from 'react';


export type MapContextData = {
    data: Property[] | undefined;
    setData: Dispatch<SetStateAction<Property[] | undefined>> | undefined;
};

export const MapContext = createContext<MapContextData>({
    data: undefined,
    setData: undefined,
});