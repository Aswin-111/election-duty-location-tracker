function Inactive (){
const data = [...squadData.squad] 
function compareGroupPatrol(a, b) {
  const numA = parseInt(a.grouppatrol.match(/\d+/)[0]); // Extract number from string
  const numB = parseInt(b.grouppatrol.match(/\d+/)[0]);
  return numA - numB; // Compare numbers
}

// Sort the array using the custom comparison function
data.sort(compareGroupPatrol);

// Output the sorted array
console.log(data);
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
            {data.map((data, index) => {
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

export default Inactive