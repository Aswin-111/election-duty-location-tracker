"use client"
import { useState, useEffect } from 'react';

const CIRCLE_MARKER_SIZE = 8;
const SQUARE_MARKER_SIZE = 10;

export default function Map() {
  const [map, setMap] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const uluru = { lat: position.coords.latitude, lng: position.coords.longitude };
        const map = new window.google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: uluru,
        });
        setMap(map);

        // Add circle markers to map
        addMarker({ lat: 9.956940, lng: 76.253540 }, map); // Ernakulam Shiva Temple
        addMarker({ lat: 9.953540, lng: 76.269010 }, map); // Chinese Fishing Nets
        addMarker({ lat: 9.949010, lng: 76.267800 }, map); // Fort Kochi Beach
        addMarker({ lat: 9.960700, lng: 76.266820 }, map); // Mattancherry Palace
        addMarker({ lat: 9.958280, lng: 76.265640 }, map); // Jew Street & Paradesi Synagogue

        // Draw polygon connecting the coordinates
        const polygonCoordinates = [
          { lat: 9.956940, lng: 76.253540 }, // Ernakulam Shiva Temple
          { lat: 9.953540, lng: 76.269010 }, // Chinese Fishing Nets
          { lat: 9.949010, lng: 76.267800 }, // Fort Kochi Beach
          { lat: 9.960700, lng: 76.266820 }, // Mattancherry Palace
          { lat: 9.958280, lng: 76.265640 }, // Jew Street & Paradesi Synagogue
        ];
        drawPolygon(polygonCoordinates, map);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Add marker to map
  const addMarker = (location, map) => {
    const shape = { coords: [1, 1, 1, 20, 18, 20, 18, 1], type: 'poly' };
    new window.google.maps.Marker({
      position: location,
      icon: {
        path: google.maps.SymbolPath.CUSTOM,
        fillColor: '#ff0000',
        fillOpacity: 1,
        scale: SQUARE_MARKER_SIZE,
        strokeColor: 'white',
        strokeWeight: 2,
      },
      shape: shape,
      map: map,
    });
  };

  // Draw polygon connecting the coordinates
  const drawPolygon = (coordinates, map) => {
    new window.google.maps.Polygon({
      paths: coordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
    });
  };

  return( <div className='flex'>
    <div className="w-[25vw] h-screen  shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
      <div className="flex flex-col items-center">
      <div className="text-black font-semibold mt-5 text-xl">Geo Tag </div>

      <div className="text-sm font-semibold">Election 2024 (Alappuzha Dist.)</div>
        </div>
        <input
          placeholder="Search Officers"
          className="w-full  mt-5 py-3 px-4 rounded-md border-2 shadow-xl"  onChange={(e)=>{
            if(e.target.value.length === 0){
              setSquadData({squad:squadData.fil,fil:squadData.fil})
            }
            const searchData = squadData.fil.filter((i,ind)=>{
                return i.officername.toLowerCase().startsWith(e.target.value.toLowerCase())
              })
              setSquadData({squad:searchData,fil:squadData.fil})

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
         

        </div>
      </div>
    <div id="map" className='w-[75vw] h-screen' />
    </div>
  )
}