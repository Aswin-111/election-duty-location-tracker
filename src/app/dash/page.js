"use client";
import { useState, useEffect } from "react";

import axios from "axios";
const CIRCLE_MARKER_SIZE = 8;
const SQUARE_MARKER_SIZE = 10;

export default function Map() {
  const [userfetchdata,setUserFetch] = useState({})
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [squadData, setSquadData] = useState({fil:[],squad:[]});

  const [btn, setBtn] = useState("");



const [id,setId] = useState(1)
  // Initialize map when component mounts
  useEffect(() => {

    (async function (){
      (async function () {
        try{
        const response = await axios.get("http://localhost:5000/users");
        console.log("data from ", response);
        if (response.data.users) {
      console.log(response.data.users,"data")
          setSquadData({inactive : [...response.data.users],squad:[...response.data.users],fil:[...response.data.users]})
          setUserFetch(response.data.users[0])
          





        }
  
      }
    
  
      
      catch(err){
        console.log(err)
      }
      })();
    if (navigator.geolocation) {
 setBtn("All")
      const response = await axios.post("http://localhost:5000/fetchuserdata",{id})
      

      // console.log(response.data.users);
      console.log(response.data.usersdata);
      const locations = response.data.usersdata.map((i)=>{
        console.log(i)
        return {id:i.id, name : i.name,lat:parseFloat(i.lat.slice(0,16)),lng:parseFloat(i.long.slice(0,16))}
      })
      const latlong = response.data.users[0].location.split(",")
      console.log(parseFloat(latlong[0].slice(0,7)),parseFloat(latlong[1].slice(0,7)))
      const userLatLng = { lat: parseFloat(latlong[0].slice(0,7)), lng: parseFloat(latlong[1].slice(0,7)) };
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
            fontSize: '12px',
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
  
  })()
  }
  
  , [id]);

  return (
    <div className="flex">
      <div className="w-[22vw] h-screen  shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
        <div className="w-[22vw] h-screen  shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
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
 <div className="w-full flex justify-evenly my-2">

<button  className={`${btn === "All" ? "bg-indigo-300 text-white px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
  setBtn("All")
}}>All</button>
<button  className={`${btn === "Active" ? "bg-indigo-300 text-white px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
  setBtn("Active")
}}>Active</button>
<button  className={`${btn === "Inactive" ? "bg-indigo-300 text-white px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
  setBtn("Inactive")

  
  setSquadData()

}}>Inactive</button>
</div>
          <div className="w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden">
            {squadData.squad.map((data,index) =>{
              return (
                <div key = {index} className="w-full flex justify-between bg-slate-300  px-7 py-2 rounded-lg mt-2" onClick={
                  ()=>{
                //     (async () => {
                //                 //  fix here the setCoord must update the array in action rerender the map with the clicked user's lat and longs
                //       const response = await axios.post("http://localhost:5000/fetchuserdata",{id:data.id})
                //     console.log(response)
                //     setSquadData({squad:[...squadData.squad,response.data.users],fil:[...squadData.fil,response.data.users]});
                //     setCoords([...response.data.usersdata]);

                //     // Redraw the polygon with the new coordinates
                //     const polygonCoordinates = response.data.usersdata.map(coord => ({
                //       lat: parseFloat(coord.lat),
                //       lng: parseFloat(coord.lng),
                //     }));
                //     const newPolygon = new window.google.maps.Polygon({
                //       paths: polygonCoordinates,
                //       strokeColor: "#FF0000",
                //       strokeOpacity: 0.8,
                //       strokeWeight: 2,
                //       fillColor: "#FF0000",
                //       fillOpacity: 0.35,
                //       map: map,
                //     });
                //     setPolygon(newPolygon);

                //     // Pan to the first marked location when a user is clicked
                //     map.panTo(response.data.usersdata[0]);
                //   }
                // )()
              
                
                
                setId(data.id)
                // setUserFetch({grouppatrol : data.grouppatrol,officername : data.officername,phone : data.phone, time : data.time, date : data.date})
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
      <div id="map" className="w-[78vw] h-screen" />
     
      <div className="w-[16vw] h-[25vh]  bg-slate-300 absolute bottom-0 left-[25vw] shadow-xl px-7 py-5 rounded-lg">
        <h1 className="text-xl font-bold">🚓    {userfetchdata.grouppatrol}</h1>
        <h1 className="text-lg font-semibold">👮    {userfetchdata.officername}</h1>
        <h1 className="text-md font-semibold">📞    {userfetchdata.phone}</h1>
        <h1 className="text-md font-semibold">📅    {userfetchdata.date}</h1>

        <h1 className="text-md font-semibold">⌛   {userfetchdata.time}</h1>
      </div>
    </div>
  );
}
