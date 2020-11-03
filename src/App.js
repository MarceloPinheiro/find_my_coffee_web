import React, { Fragment, useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import EstablishmentService from './services/establishment_service';
import Establishment from './components/Establishment';
import NearstCoffees from './components/NearCoffees';

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locations, setLocation] = useState([]);
  const [selected, setSelected] = useState({});

  const { REACT_APP_GOOGLE_API_KEY } = process.env;

  async function setCurrentLocation() {
    await navigator.geolocation.getCurrentPosition(function(position){
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      loadCoffeeShops();
    },function(error){
      alert("Habilite a localização para usar este app");
    });
  }

  async function loadCoffeeShops(){
    const response = await EstablishmentService.index(latitude,longitude);
    setLocation(response.data.results);
  }

  useEffect(() => {
    setCurrentLocation();
  },[]);

  console.log({REACT_APP_GOOGLE_API_KEY});
  return (
    <Fragment>
      <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
        <GoogleMap 
          mapContainerStyle={{height: "100vh", width: "100%"}}
          zoom={15}
          center={{lat: latitude,lng: longitude}}
          >

            {
              locations.map((item,index) => {
                return(
                  <Marker key={index} icon="/images/coffee-pin.png"
                  title={item.name} 
                  animation="4" 
                  position={{lat: item.geometry.location.lat, lng: item.geometry.location.lng}} 
                  onClick={() => setSelected(item)}/>
                );
              })
            
            }
            {
              selected.place_id && (
                <Establishment place={selected}/>
              )
            }
            <Marker key="MyLocation" icon="/images/my-location-pin.png" title="Seu Local" animation="2" position={{lat: latitude, lng:longitude}} />

            {(latitude != 0 && longitude != 0) &&
              <NearstCoffees latitude={latitude} longitude={longitude} />
            }
        </GoogleMap>

      </LoadScript>

    </Fragment>
  );
}

export default App;
