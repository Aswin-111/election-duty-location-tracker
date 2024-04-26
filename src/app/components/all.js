





function Options({id,setId,btn,setBtn}){

    return (
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
                  const diffInMinutes = moment.duration(
                    moment(specificTimeString, "HH:mm").diff(
                      moment(currentHoursMinutes, "HH:mm")
                    )
                  ).asMinutes();
              
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
                  const diffInMinutes = moment.duration(
                    moment(specificTimeString, "HH:mm").diff(
                      moment(currentHoursMinutes, "HH:mm")
                    )
                  ).asMinutes();
              
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
                  <div>
                    <span className="font-semibold text-sm">{data.grouppatrol}</span>
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
    )
}

export default Options