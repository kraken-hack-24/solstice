"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"


import MarkerClusterGroup from 'next-leaflet-cluster';
import 'next-leaflet-cluster/lib/assets/MarkerCluster.css'
import 'next-leaflet-cluster/lib/assets/MarkerCluster.Default.css'
import 'next-leaflet-cluster/lib/assets/marker-icon-2x.png'
import 'next-leaflet-cluster/lib/assets/marker-icon.png'
import 'next-leaflet-cluster/lib/assets/marker-shadow.png'

import { useEffect, useState } from 'react';
import { Property } from '../models/property.model';
import { MapContextProvider } from '@/contexts/mapdata/MapContextProvider';
import L from 'leaflet';
const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

const MapPage = () => {
    // const {data, setData} = useMapContext();
    const [data, setData] = useState();

    useEffect(() => {
        async function fetchData() {
          const response = await fetch('/api/property');
          const result = await response.json();
          console.log('Data', result)
          setData(result);
        }
        
        fetchData();
    }, []);
    
    return (
        <MapContextProvider>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MarkerClusterGroup>
            
            {data ? data?.map((property: Property) => {
                // return null
                return (
                    <Marker position={[property.latitude ?? 0, property.longitude ?? 0]} icon={icon}>
                        <Popup>
                            {JSON.stringify(property)}
                        </Popup>
                    </Marker>
                );
            }) : null}
            {/* <Marker position={[51.505, -0.09]} >
                <Popup>
                    A Property
                </Popup>
            </Marker> */}
            </MarkerClusterGroup>
        </MapContainer>
        </MapContextProvider>
    );
}

export default MapPage;