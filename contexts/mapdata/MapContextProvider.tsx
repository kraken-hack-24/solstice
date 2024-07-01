import React, { useEffect, useState } from 'react';
import { MapContext, MapContextData } from './map-context';
import { Property } from '@/app/models/property.model';

type MapContextProviderProps = {
    children: JSX.Element | string;
};

export const MapContextProvider = ({ children }: MapContextProviderProps) => {
    const [data, setData] = useState<Property[] | undefined>();

    const value: MapContextData = {
        data,
        setData,
    };

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};