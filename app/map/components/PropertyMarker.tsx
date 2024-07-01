import { Property } from "@/app/models/property.model";
import { Marker, Popup } from "react-leaflet";

interface PropertyMarkerProps {
    property: Property
}
import {icon} from 'leaflet';

const lIcon = icon({ iconUrl: "/images/marker-icon.png" });


const PropertyMarker = ({ property }: PropertyMarkerProps) => {
    return (
        <Marker position={[property.latitude ?? 0, property.longitude ?? 0]} icon={lIcon}>
            <Popup>
                {JSON.stringify(property)}
            </Popup>
        </Marker>
    );
}

export default PropertyMarker;