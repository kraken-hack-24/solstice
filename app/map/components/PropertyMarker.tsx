import { Property } from "@/app/models/property.model";
import { Marker, Popup } from "react-leaflet";

interface PropertyMarkerProps {
    property: Property
}
import { icon } from 'leaflet';
import { useMapContext } from "@/contexts/mapdata/useMapContext";

const lIcon = icon({ iconUrl: "/images/marker-icon.png" });
const lIconXl = icon({ iconUrl: "/images/marker-icon-2x.png" });


const PropertyMarker = ({ property }: PropertyMarkerProps) => {
    const {selectedProperty, setSelectedProperty, map} = useMapContext();

    function getMarkerIcon() {
        if(property?.address_1 && (selectedProperty?.address_1 === property.address_1)) {
            return lIconXl
        }
        return lIcon
      }
    
    return (
        <Marker position={[property.latitude ?? 0, property.longitude ?? 0]} 
        icon={getMarkerIcon()}
            eventHandlers={{
                click: (e) => {
                    console.log('marker clicked', e)
                    setSelectedProperty(property)
                    map?.setView([property.latitude, property.longitude], 16)
                    // alert(`${property.address_1} clicked`)

                    // set selected = property.id
                },
            }}
        >
            {/* <Popup>
                {JSON.stringify(property)}
            </Popup> */}
        </Marker>
    );
}

export default PropertyMarker;