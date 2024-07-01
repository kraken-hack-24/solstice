"use client";

import { MapContextProvider } from '@/contexts/mapdata/MapContextProvider';
import { useMapContext } from '@/contexts/mapdata/useMapContext';
import LeafletMap from './components/LeafletMap';
import { Property } from '../models/property.model';

const MapPage = () => {
    // const [data, setData] = useState();


    // if (!data) {
    //     return (<p>Loading...</p>);
    // }

    return (
        <MapContextProvider>
            <LeafletMap></LeafletMap>
        </MapContextProvider>  
    );
}

export default MapPage;