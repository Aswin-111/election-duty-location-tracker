


"use client"
import { useState, useEffect } from "react";
import axios from "axios";
const CIRCLE_MARKER_SIZE = 8;
const SQUARE_MARKER_SIZE = 10;

export default function Map() {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [squadData, setSquadData] = useState({fil:[],squad:[]});
const [usersData, setUserData] = useState({})
  const [coords, setCoords] = useState([]);
const [locations,setlocations] = useState([
  { lat: 9.95694, lng: 76.25354, name: "Booth 1" },
  { lat: 9.94901, lng: 76.2678, name: "Booth 2" },
  { lat: 9.95354, lng: 76.26901, name: "Booth 3" },

  { lat: 9.9607, lng: 76.26682, name: "Booth 4" },
  {
    lat: 9.95828,
    lng: 76.26564,
    name: "Booth 5",
  },
])
  // Initialize map when component mounts
  useEffect(() => {

    (async function () {
      try{
      const response = await axios.get("http://localhost:5000/users");
      console.log("data from ", response);
      if (response.data.users) {
    console.log(response.data.users,"data")
        setSquadData({squad:[...response.data.users],fil:[...response.data.users]});
      }

    }
  

    
    catch(err){
      console.log(err)
    }
    })();
    if (navigator.geolocation) {
      const userLatLng = { lat: 9.956599, lng: 76.2602788 };
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 16 - 1,
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
            fontSize: '19px',
            fontWeight: 'bold',
            color : "black"
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
  }, [locations]);

  // Update the coords state when the polygon coordinates change
  useEffect(() => {
    if (polygon) {
      const polygonCoordinates = polygon.getPath().getArray().map(coord => ({
        lat: coord.lat(),
        lng: coord.lng(),
      }));
      setCoords(polygonCoordinates);
    }
  }, [polygon]);

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

          <div className="w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden">
            {squadData.squad.map((data,index) =>{
              return (
                <div key = {index} className="w-full flex justify-between bg-slate-300  px-7 py-3 rounded-lg mt-5" onClick={
                  ()=>{
                    (async () => {
                                //  fix here the setCoord must update the array in action rerender the map with the clicked user's lat and longs
                      const response = await axios.post("http://localhost:5000/fetchuserdata",{id:data.id})
                    console.log(response)
                    setSquadData({squad:[...squadData.squad,response.data.users],fil:[...squadData.fil,response.data.users]});
                    setCoords([...response.data.usersdata]);

                    // Redraw the polygon with the new coordinates
                    const polygonCoordinates = response.data.usersdata.map(coord => ({
                      lat: parseFloat(coord.lat),
                      lng: parseFloat(coord.lng),
                    }));
                    const newPolygon = new window.google.maps.Polygon({
                      paths: polygonCoordinates,
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#FF0000",
                      fillOpacity: 0.35,
                      map: map,
                    });
                    setPolygon(newPolygon);

                    // Pan to the first marked location when a user is clicked
                    map.panTo(response.data.usersdata[0]);
                  }
                )()
                  }
                }>
                  {/* date
: 
"2024-04-15"
grouppatrol
: 
"GP1"
id
: 
1
location
: 
"9.88160398988491,76.3027464598417"
officername
: 
"Ramesh"
phone
: 
"6445515151"
status
: 
null
time
: 
"16:11" */}
                  <div>
                    <span className="font-semibold ">{data.grouppatrol}</span>
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
              )
            })}
          </div>
        </div>
      </div>
      <div id="map" className="w-[75vw] h-screen" />
      <div className="w-[16vw] h-[25vh]  bg-slate-300 absolute bottom-0 left-[25vw] shadow-xl px-7 py-5 rounded-lg">
        <h1 className="text-xl font-bold">🚓    {usersData.grouppatrol}</h1>
        <h1 className="text-lg font-semibold">👮    {usersData.officername}</h1>
        <h1 className="text-md font-semibold">📞    {usersData.phone}</h1>
        <h1 className="text-md font-semibold">📅    {usersData.date}</h1>

        <h1 className="text-md font-semibold">⌛   {usersData.time}</h1>
      </div>
    </div>
  );
}
// Your array of objects
let patrols = [
  { id: 131, grouppatrol: 'Group Patrol 40', officername: 'Anilkumar B', location: '9.4994016,76.3258601', phone: '9496433455' },
  { id: 138, grouppatrol: 'Group Patrol 26', officername: 'Manoj U Krishnan', location: '9.6152692,76.3636715', phone: '9447347987' },
  { id: 139, grouppatrol: 'Group Patrol 37', officername: 'Kabeer C E', location: '9.5759364,76.3487142', phone: '9446346091' },
  { id: 140, grouppatrol: 'Group Patrol 3', officername: 'Joseph Stanley KJ', location: '9.4996158,76.3259343', phone: '9846851049' },
  { id: 141, grouppatrol: 'Group Patrol 58', officername: 'Devasia M J', location: '9.4387401,76.4255668', phone: '9744563678' },
  { id: 142, grouppatrol: 'Group Patrol 22', officername: 'Sali C C', location: '9.6308629,76.3273136', phone: '9544028831' },
  { id: 143, grouppatrol: 'Group Patrol 31', officername: 'Jomon PA', location: '9.5249167,76.3261283', phone: '9745033834' }
];

// Custom comparison function to extract the number from the grouppatrol field
// function compareGroupPatrol(a, b) {
//   const numA = parseInt(a.grouppatrol.match(/\d+/)[0]); // Extract number from string
//   const numB = parseInt(b.grouppatrol.match(/\d+/)[0]);
//   return numA - numB; // Compare numbers
// }

// // Sort the array using the custom comparison function
// patrols.sort(compareGroupPatrol);

// // Output the sorted array
// console.log(patrols);
