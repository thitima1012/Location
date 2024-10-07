import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function App() {
  const center = [13.838510043535697, 100.02535680572677];
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({
    lat: "", //ละจิจูด
    lng: "", //ลองจิจูด
  });
  const [deliveryZone, setDeliveryZone] = useState({
    lat: "13.82804643",
    lng: "100.04233271",
    radius: 1000,
  });

// function to calculate distance between 2 points using Haversine Formular
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; //Eath radius in meters
    const phi_1 = (lat1 * Math.PI) / 180;
    const phi_2 = (lat2 * Math.PI) / 180;

    const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; //Distance in meters
  };

  const apiURL = import.meta.env.VITE_BASE_API;

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  // Create new component in the same file
  const LocationMap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setMyLocation({ lat, lng });
      },
    });
    return (
      <Marker position={[myLocation.lat, myLocation.lng]}>
        <Popup>My current location</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(apiURL + "/api/stores");
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStores();
  }, []);

  const handleLocationCheck = () =>{
    if(!myLocation.lat === "" || myLocation.lng === ""){
      Swal.fire({
        title: "Error!",
        text: "Please Enter your valid Store location",
        icon: "error",
        confirmButtonText: "OK!!",
      });
      return;
    }
    if (!deliveryZone.lat === "" || deliveryZone.lng === "") {
      Swal.fire({
        title: "Error!",
        text: "Please Enter your valid Store location",
        icon: "error",
        confirmButtonText: "OK!!",
      });
      return;
    }
    const distance = calculateDistance(
      myLocation.lat, 
      myLocation.lng, 
      deliveryZone.lat, 
      deliveryZone.lng
    );
    if(distance <= deliveryZone.radius){
      Swal.fire({
        title: "Success",
        text: "You are with in the delivery zone",
        icon: "success",
        confirmButtonText: "OK!!",
      });
    }else{
      Swal.fire({
        title: "Error!",
        text: "You are outside the delivery zone",
        icon: "error",
        confirmButtonText: "OK!!",
      });
    }
  }

  return (
    <div className="p-3">
      <h1 className="text-center text-3xl font-bold mb-3">
        Store Delivery Zone Checker
      </h1>
      <div className="flex justify-center items-center mx-auto mb-3 space-x-2">
        <button onClick={handleGetLocation} className="btn btn-ghost">
          Get My location
        </button>
        <button onClick={handleLocationCheck} className="btn btn-outline">
          Check Delivery zone
        </button>
      </div>
      <div className="flex justify-center items-center mx-auto">
        {" "}
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "85vh", width: "90vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[myLocation.lat, myLocation.lng]}>
            <Popup>My current location</Popup>
          </Marker>
          {/* {stores &&
            stores.map((store) => {
              return (
                <Marker position={[store.lat, store.lng]}>
                  <Popup>
                    <b>{store.name}</b>
                    <p>{store.address}</p>
                    <p>{store.id}</p>
                  </Popup>
                </Marker>
              );
            })} */}
          {/* Use Location here */}
          <LocationMap />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
