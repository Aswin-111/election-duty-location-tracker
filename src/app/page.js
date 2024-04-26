"use client";
import { useState, useEffect } from "react";

import axios from "axios";
import car from "@/app/car.png";
const CIRCLE_MARKER_SIZE = 8;
const SQUARE_MARKER_SIZE = 10;

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

  const [id, setId] = useState(0);
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

          const patrols = [...response.data.users];
          function compareGroupPatrol(a, b) {
            const numA = parseInt(a.grouppatrol.match(/\d+/)[0]); // Extract number from string
            const numB = parseInt(b.grouppatrol.match(/\d+/)[0]);
            return numA - numB; // Compare numbers
          }

          // Sort the array using the custom comparison function
          patrols.sort(compareGroupPatrol);

          // Output the sorted array
          console.log(patrols);
          setSquadData({
            inactive: [...patrols],
            squad: [...patrols],
            fil: [...patrols],
          });
          setUserFetch(patrols[0]);
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

        let userdetails;

        let userlocationdetails;
        let latlong;

        if (!id) {
          const resp = await axios.get(
            "https://www.easybiztechnologies.shop/users"
          );

          const userslist = [...resp.data.users];
          function compareGroupPatrol(a, b) {
            const numA = parseInt(a.grouppatrol.match(/\d+/)[0]); // Extract number from string
            const numB = parseInt(b.grouppatrol.match(/\d+/)[0]);
            return numA - numB; // Compare numbers
          }

          // Sort the array using the custom comparison function
          userslist.sort(compareGroupPatrol);

          // Output the sorted array
          console.log(userslist);
          userdetails = userslist[0];

          userlocationdetails = userslist;
          latlong = userslist[0].location.split(",");
        } else {
          const resp = await axios.get(
            "https://www.easybiztechnologies.shop/users"
          );

          const userslist = [...resp.data.users];
          function compareGroupPatrol(a, b) {
            const numA = parseInt(a.grouppatrol.match(/\d+/)[0]); // Extract number from string
            const numB = parseInt(b.grouppatrol.match(/\d+/)[0]);
            return numA - numB; // Compare numbers
          }

          // Sort the array using the custom comparison function
          userslist.sort(compareGroupPatrol);
          latlong = userslist[0].location.split(",");
        }

        //  console.log(fetchoneid,id?id:fetchoneid,"id test");
        const response = await axios.post(
          "https://www.easybiztechnologies.shop/fetchuserdata",

          { id: id ? id : userdetails.id }
        );

        // const resp = await axios.post("https://www.easybiztechnologies.shop/query", { query :   `SELECT * FROM users WHERE id = ${fetchid}` })

        const locations = response.data.usersdata.map((i, ind) => {
          return {
            id: i.id,

            name: `${i.name}`,
            lat: parseFloat(i.lat.slice(0, 16)),
            lng: parseFloat(i.long.slice(0, 16)),
          };
        });

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
          const patrols = [...response.data.users];
          function compareGroupPatrol(a, b) {
            const numA = parseInt(a.grouppatrol.match(/\d+/)[0]); // Extract number from string
            const numB = parseInt(b.grouppatrol.match(/\d+/)[0]);
            return numA - numB; // Compare numbers
          }

          // Sort the array using the custom comparison function
          patrols.sort(compareGroupPatrol);

          // Output the sorted array
          console.log(patrols);
          setSquadData({
            inactive: [...patrols],
            squad: [...patrols],
            fil: [...patrols],
          });
          setUserFetch(patrols[0]);
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
            placeholder="Search Patrols"
            className="w-full  mt-5 py-3 px-4 rounded-md border-2 shadow-xl"
            onChange={(e) => {
              if (e.target.value.length === 0) {
                setSquadData({
                  squad: squadData.fil,
                  fil: squadData.fil,
                  inactive: squadData.inactive,
                });
              }
              const searchData = squadData.fil.filter((i, ind) => {
                return i.grouppatrol
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase());
              });
              setSquadData({
                squad: searchData,
                fil: squadData.fil,
                inactive: squadData.inactive,
              });
            }}
          />
          <div className="w-full flex justify-evenly my-2">
            <button
              className={`${
                btn === "All"
                  ? "bg-indigo-300 text-white px-4 py-1 rounded-md font-semibold"
                  : "px-4 py-1 border-none"
              }`}
              onClick={() => {
                setBtn("All");
                setSquadData({
                  squad: squadData.fil,
                  fil: squadData.fil,
                  inactive: squadData.inactive,
                });
              }}
            >
              All
            </button>
            <button
              className={`${
                btn === "Active"
                  ? "bg-indigo-300 text-white px-4 py-1 rounded-md font-semibold"
                  : "px-4 py-1 border-none"
              }`}
              onClick={() => {
                setBtn("Active");

                const inactive = squadData.squad.filter((i, ind) => {
                  const moment = require("moment");
                  const currentHoursMinutes = moment().format("HH:mm");
                  const specificTimeString = i.time;
                  const diffInMinutes = moment
                    .duration(
                      moment(specificTimeString, "HH:mm").diff(
                        moment(currentHoursMinutes, "HH:mm")
                      )
                    )
                    .asMinutes();

                  const diffInHours = Math.floor(diffInMinutes / 60);
                  const diffInRemainingMinutes = Math.round(diffInMinutes % 60);

                  console.log(
                    `The remaining time is ${diffInHours} hour${
                      diffInHours !== 1 ? "s" : ""
                    } and ${diffInRemainingMinutes} minute${
                      diffInRemainingMinutes !== 1 ? "s" : ""
                    }.`
                  );

                  return diffInMinutes <= 120;
                });

                setSquadData({
                  squad: inactive,
                  fil: squadData.fil,
                  inactive: squadData.inactive,
                });
              }}
            >
              Active
            </button>
            <button
              className={`${
                btn === "Inactive"
                  ? "bg-indigo-300 text-white px-4 py-1 rounded-md font-semibold"
                  : "px-4 py-1 border-none"
              }`}
              onClick={() => {
                setBtn("Inactive");

                const inactive = squadData.squad.filter((i, ind) => {
                  const moment = require("moment");
                  const currentHoursMinutes = moment().format("HH:mm");
                  const specificTimeString = i.time;
                  const diffInMinutes = moment
                    .duration(
                      moment(specificTimeString, "HH:mm").diff(
                        moment(currentHoursMinutes, "HH:mm")
                      )
                    )
                    .asMinutes();

                  const diffInHours = Math.floor(diffInMinutes / 60);
                  const diffInRemainingMinutes = Math.round(diffInMinutes % 60);

                  console.log(
                    `The remaining time is ${diffInHours} hour${
                      diffInHours !== 1 ? "s" : ""
                    } and ${diffInRemainingMinutes} minute${
                      diffInRemainingMinutes !== 1 ? "s" : ""
                    }.`
                  );

                  return diffInMinutes > 120;
                });

                setSquadData({
                  squad: inactive,
                  fil: squadData.fil,
                  inactive: squadData.inactive,
                });
              }}
            >
              Inactive
            </button>
          </div>
          <div className="w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden">
            {squadData.squad.map((data, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex justify-between bg-slate-300  px-7 py-2 rounded-lg mt-2"
                  onClick={() => {
                    (async () => {
                      setId(data.id);

                      try {
                        const response = await axios.post(
                          "https://www.easybiztechnologies.shop/getuser",
                          {
                            id: data.id,
                          }
                        );
                        setUserFetch(response.data.data);
                      } catch (err) {
                        console.log(err);
                      }
                    })();
                    // setUserFetch({grouppatrol : data.grouppatrol,officername : data.officername,phone : data.phone, time : data.time, date : data.date})
                  }}
                >
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
                    <span className="font-semibold text-sm">
                      {data.grouppatrol}
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">Active </span>{" "}
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <span className="text-sm">{data.officername}</span>
                    <span className="text-sm">{data.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
