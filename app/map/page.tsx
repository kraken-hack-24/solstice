"use client";

import { MapContextProvider } from '@/contexts/mapdata/MapContextProvider';
import { useMapContext } from '@/contexts/mapdata/useMapContext';
import LeafletMap from './components/LeafletMap';
import { Property } from '../models/property.model';
import PropertyPanel from './components/PropertyPanel';

const MapPage = () => {
    const { selectedProperty } = useMapContext();

    const renderSelectedProp = () => {
        if (!selectedProperty) {
            return  <p>No property selected</p>;
        }

        return (
            <PropertyPanel property={selectedProperty}/>
        )
    }

    return (

            <>
                <LeafletMap></LeafletMap>

                {renderSelectedProp()}

            </>
    );
}

export default MapPage;