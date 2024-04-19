"use client";
import { useState, useEffect } from "react";

const CIRCLE_MARKER_SIZE = 8;
const SQUARE_MARKER_SIZE = 10;

export default function Map() {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      const userLatLng = { lat: 9.956599, lng: 76.2602788 };
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 13,
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

      // Add circle markers to map
      const locations = [
        { lat: 9.95694, lng: 76.25354, name: "Ernakulam Shiva Temple" },
        { lat: 9.94901, lng: 76.2678, name: "Fort Kochi Beach" },
        { lat: 9.95354, lng: 76.26901, name: "Chinese Fishing Nets" },

        { lat: 9.9607, lng: 76.26682, name: "Mattancherry Palace" },
        {
          lat: 9.95828,
          lng: 76.26564,
          name: "Jew Street & Paradesi Synagogue",
        },
      ];
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
          map: map,
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
  }, []);

  return (
    <div className="flex">
      <div className="w-[25vw] h-screen  shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
        <div className="w-[25vw] h-screen  shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
          <div className="flex flex-col items-center">
            <div className="text-black font-semibold mt-5 text-xl">
              Geo Tag{" "}
            </div>

            <div className="text-sm font-semibold">
              Election 2024 (Alappuzha Dist.)
            </div>
          </div>
          <input
            placeholder="Search Officers"
            className="w-full  mt-5 py-3 px-4 rounded-md border-2 shadow-xl"
            onChange={(e) => {
              if (e.target.value.length === 0) {
                setSquadData({ squad: squadData.fil, fil: squadData.fil });
              }
              const searchData = squadData.fil.filter((i, ind) => {
                return i.officername
                  .toLowerCase()
                  .startsWith(e.target.value.toLowerCase());
              });
              setSquadData({ squad: searchData, fil: squadData.fil });
            }}
          />

          {/* <div className="w-full flex justify-evenly my-4">

        <button  className={`${btn === "All" ? "border-2 px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
          setBtn("All")
        }}>All</button>
        <button  className={`${btn === "Active" ? "border-2 px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
          setBtn("Active")
        }}>Active</button>
        <button  className={`${btn === "Inactive" ? "border-2 px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
          setBtn("Inactive")
        }}>Inactive</button>
      </div> */}
          <div className="w-full  max-h-[80vh]  overflow-y-scroll overflow-x-hidden">
            {/* {squadData.squad.map((data,index) =>{
            return (
            <div key = {index} className="w-full h-16 my-2 rounded-[0.5rem] shadow-xl border-2 border-indigo-400 flex justify-between items-center px-3" onClick = {
              ()=>{
   

                const location = data.location.split(",")
                const lat = location[0]
                const long = location[1]
                setUserData({groupname:data.grouppatrol,officername :data.officername, phone :data.phone,  time :data.time ,date : data.date})
                
                setCoordinates({lat,long})
              }
            }>

            <div className="w-full flex justify-between">
              <div>
              <span className="font-semibold ">{data.grouppatrol}</span>
              <div className="flex items-center"><span className="mr-2">Active </span> <div className="w-3 h-3 bg-emerald-500 rounded-full"></div></div>

            </div>
           
           
           <div className="flex flex-col">
           <span>{data.officername}</span>
           <span>{data.phone}</span>
</div>

           </div>
          </div>
            )
          })} */}
            <div className="w-full flex justify-between bg-slate-300  px-7 py-3 rounded-lg mt-5">
              <div>
                <span className="font-semibold ">Group patrol 1</span>
                <div className="flex items-center">
                  <span className="mr-2">Active </span>{" "}
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <span>Ramesh</span>
                <span>9567575024</span>
              </div>
            </div>

            <div className="w-full  flex justify-between bg-slate-300 px-7 py-3 rounded-lg mt-5">
              <div>
                <span className="font-semibold ">Group patrol 2</span>
                <div className="flex items-center">
                  <span className="mr-2">Active </span>{" "}
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <span>Vinod kumar</span>
                <span>9847049701</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="map" className="w-[75vw] h-screen" />
    </div>
  );
}
