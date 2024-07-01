"use client";

import { MapContextProvider } from '@/contexts/mapdata/MapContextProvider';
import { useMapContext } from '@/contexts/mapdata/useMapContext';
import LeafletMap from './components/LeafletMap';
import { Property } from '../models/property.model';
import PropertyPanel from './components/PropertyPanel';

const MapPage = () => {
    const { selectedProperty } = useMapContext();

    const selectedProp = () => {
        if (!selectedProperty) {
            return null;
        }

        return (
            <div>
               <PropertyPanel property={selectedProperty}/> 
            </div>
        )
    }

    return (
        <MapContextProvider>
            <>
                <LeafletMap></LeafletMap>
                {selectedProp()}
            </>
        </MapContextProvider>
    );
}

export default MapPage;