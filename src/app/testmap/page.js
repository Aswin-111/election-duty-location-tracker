"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";

const CIRCLE_MARKER_SIZE = 8;

export default function Map() {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [squadData, setSquadData] = useState({ fil: [], squad: [] });
  const [usersData, setUsersData] = useState({});
  const [locations, setCoords] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      // Geolocation supported
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 16,
            center: userLatLng,
          });
          setMap(map);

          // Add user location marker
          const userMarker = new window.google.maps.Marker({
            position: userLatLng,
            icon: {
              url: "https://maps.google.com/mapfiles/kml/paddle/O.png", // Use a pin icon for user location
              scaledSize: new window.google.maps.Size(40, 40),
            },
            map: map,
          });
          setUserLocation(userMarker);

          map.panTo(userLatLng);
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  const handleUserClick = async (id) => {
    try {
      const response = await axios.post("http://localhost:5000/fetchuserdata", { id });
      setUsersData(response.data.users);
      const fetchedLocations = response.data.usersdata.map((userData) => ({
        lat: parseFloat(userData.location.split(",")[0]),
        lng: parseFloat(userData.location.split(",")[1]),
        name: userData.officername,
      }));
      setCoords(fetchedLocations);

      // Clear previous markers
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      setMarkers([]);

      // Add markers for fetched locations
      fetchedLocations.forEach((location) => {
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
            fontSize: "19px",
            fontWeight: "bold",
            color: "black",
          },
        });
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      });

      // Draw polygon connecting the coordinates
      const polygonCoordinates = fetchedLocations.map((location) => ({
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
      map.panTo(fetchedLocations[0]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[25vw] h-screen shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
        {/* Sidebar content */}
        <div className="w-[25vw] h-screen shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
          <div className="flex flex-col items-center">
            <div className="text-black font-semibold mt-5 text-xl">Geo Tag</div>
            <div className="text-sm font-semibold">Election 2024 (Alappuzha Dist.)</div>
          </div>
          <input
            placeholder="Search Officers"
            className="w-full mt-5 py-3 px-4 rounded-md border-2 shadow-xl"
            onChange={(e) => {
              if (e.target.value.length === 0) {
                setSquadData({ squad: squadData.fil, fil: squadData.fil });
              }
              const searchData = squadData.fil.filter((i, ind) => {
                return i.officername.toLowerCase().startsWith(e.target.value.toLowerCase());
              });
              setSquadData({ squad: searchData, fil: squadData.fil });
            }}
          />
          <div className="w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden">
            {squadData.squad.map((data, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex justify-between bg-slate-300 px-7 py-3 rounded-lg mt-5"
                  onClick={() => handleUserClick(data.id)}
                >
                  <div>
                    <span className="font-semibold">{data.grouppatrol}</span>
                    <div className="flex items-center">
                      <span className="mr-2">Active </span>{" "}
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span>{data.officername}</span>
                    <span>{data.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map */}
      <div id="map" className="w-[75vw] h-screen" />

      {/* User Info */}
      <div className="w-[16vw] h-[25vh] bg-slate-300 absolute bottom-0 left-[25vw] shadow-xl px-7 py-5 rounded-lg">
        <h1 className="text-xl font-bold">🚓 {usersData.grouppatrol}</h1>
        <h1 className="text-lg font-semibold">👮 {usersData.officername}</h1>
        <h1 className="text-md font-semibold">📞 {usersData.phone}</h1>
        <h1 className="text-md font-semibold">📅 {usersData.date}</h1>
        <h1 className="text-md font-semibold">⌛ {usersData.time}</h1>
      </div>
    </div>
  );
}
