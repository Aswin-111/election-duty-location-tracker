"use client";
import { useState, useEffect } from "react";

import axios from "axios";
import car from '@/app/car.png'
const CIRCLE_MARKER_SIZE = 8;
const SQUARE_MARKER_SIZE = 10;










































import Active from '@/app/components/active'
import Inactive from '@/app/components/active'
import All from '@/app/components/active'




export default function Map() {
  const [userfetchdata, setUserFetch] = useState({});
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [squadData, setSquadData] = useState({
    fil: [],
    squad: [],
    inactive: [],
  });

  const [btn, setBtn] = useState("");

  const [id, setId] = useState(1);
  // Initialize map when component mounts
  useEffect(() => {
    (async function () {
      try {
        const response = await axios.get(
          "https://www.easybiztechnologies.shop/users"
        );
        console.log("data from ", response);
        if (response.data.users) {
          console.log(response.data.users, "data");
          setSquadData({
            inactive: [...response.data.users],
            squad: [...response.data.users],
            fil: [...response.data.users],
          });
          setUserFetch(response.data.users[0]);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  useEffect(() => {
    (async function () {
      if (navigator.geolocation) {
        setBtn("All");
        const response = await axios.post(
          "https://www.easybiztechnologies.shop/fetchuserdata",
          { id }
        );
       
        
          //   const userresponse = await axios.get(
          //     "https://www.easybiztechnologies.shop/users"
          //   );
          //   console.log("data from ", response);
          //   if (response.data.users) {
          //     console.log(response.data.users, "data");
          //     setSquadData({
          //       inactive: [...response.data.users],
          //       squad: [...response.data.users],
          //       fil: [...response.data.users],
          //     });
          //     setUserFetch(response.data.users[0]);
          //   }
          // } catch (err) {
          //   console.log(err);
          // }

        // console.log(response.data.users);
        console.log(response.data.usersdata,'data to');
        const locations = response.data.usersdata.map((i, ind) => {
          return {
            id: i.id,

            name: `booth ${ind + 1}`,
            lat: parseFloat(i.lat.slice(0, 16)),
            lng: parseFloat(i.long.slice(0, 16)),
          };
        });
        const latlong = response.data.users[0].location.split(",");
        console.log(
          parseFloat(latlong[0].slice(0, 7)),
          parseFloat(latlong[1].slice(0, 7))
        );
        const userLatLng = {
          lat: parseFloat(latlong[0].slice(0, 7)),
          lng: parseFloat(latlong[1].slice(0, 7)),
        };
        const map = new window.google.maps.Map(document.getElementById("map"), {
          zoom: 16 - 1,
          center: userLatLng,
        });
        setMap(map);

        // Add user location marker
        const userMarker = new window.google.maps.Marker({
          position: userLatLng,
          icon: {
            url: "https://maps.google.com/mapfiles/kml/paddle/P.png", // Use a pin icon for user location
            scaledSize: new window.google.maps.Size(60, 60),
          },
          map: map,
        });
        setUserLocation(userMarker);

        // Add circle markers to map

        // const locations = [
        //   { lat: 9.95694, lng: 76.25354, name: "Booth 1" },
        //   { lat: 9.94901, lng: 76.2678, name: "Booth 2" },
        //   { lat: 9.95354, lng: 76.26901, name: "Booth 3" },

        //   { lat: 9.9607, lng: 76.26682, name: "Booth 4" },
        //   {
        //     lat: 9.95828,
        //     lng: 76.26564,
        //     name: "Booth 5",
        //   },
        // ];
        locations.forEach((location) => {
          const marker = new window.google.maps.Marker({
            position: location,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#ff0000",
              fillOpacity: 1,
              scale: CIRCLE_MARKER_SIZE,
              strokeColor: "white",
              strokeWeight: 2,
            },
            map,
            label: {
              text: location.name,
              fontSize: "12px",
              fontWeight: "bold",
              color: "black",
            },
          });
          setMarkers((prevMarkers) => [...prevMarkers, marker]);
        });

        // Draw polygon connecting the coordinates
        const polygonCoordinates = locations.map((location) => ({
          lat: location.lat,
          lng: location.lng,
        }));
        const polygon = new window.google.maps.Polygon({
          paths: polygonCoordinates,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map,
        });
        setPolygon(polygon);

        // Pan to the first marked location when page loads
        map.panTo(locations[0]);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    })();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://www.easybiztechnologies.shop/users"
        );
        console.log("data from ", response);
        if (response.data.users) {
          console.log(response.data.users, "data");
          setSquadData({
            inactive: [...response.data.users],
            squad: [...response.data.users],
            fil: [...response.data.users],
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    const intervalId = setInterval(fetchData, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex">
      

      {btn === "Active" && <Active btn = {btn} id = {id} setId = {setId} squadData = {squadData} setSquadData = {setSquadData}/>}
      {btn === "Inactive" && <Inactive btn = {btn} id = {id} setId = {setId} squadData = {squadData} setSquadData = {setSquadData}/>}
      {btn === "All" && <All btn = {btn} id = {id} setId = {setId} squadData = {squadData} setSquadData = {setSquadData}/>}
      <div id="map" className="w-[78vw] h-screen" />

      <div className="w-[16vw] h-[22vh]  bg-slate-300 absolute bottom-0 left-[22vw] shadow-xl px-7 py-5 rounded-lg">
        <h1 className="text-xl font-bold">🚓 {userfetchdata.grouppatrol}</h1>
        <h1 className="text-lg font-semibold">
          👮 {userfetchdata.officername}
        </h1>
        <h1 className="text-md font-semibold">📞 {userfetchdata.phone}</h1>
        <h1 className="text-md font-semibold">📅 {userfetchdata.date}</h1>

        <h1 className="text-md font-semibold">⌛ {userfetchdata.time}</h1>
      </div>
    </div>
  );
}
