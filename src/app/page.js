"use client";
import { useEffect,useState,useRef } from "react";
import axios from "axios";
// import io from 'socket.io-client';

export default function Home() {
  const [squadData, setSquadData] = useState({fil:[],squad:[]});
  const [squadFill, setSquadFill] = useState([]);
  
  

  
  
  const [coordinates,setCoordinates] = useState({});
  const [userData,setUserData] = useState({});
  






  

  const [btn,setBtn] = useState("")

  
  const searchRef = useRef("")
  let setIntervalId;

  useEffect(() => {
    (async function () {
      const response = await axios.get("https://www.easybiztechnologies.shop/users");
      console.log("data from ", response);
      if (response.data.users) {
       
        const location = response.data.users[0].location.split(",")
                const lat = location[0]
                const long = location[1]
                setCoordinates({lat,long})
    console.log(response.data.users[0],"data")
        setSquadData({squad:[...response.data.users],fil:[...response.data.users]});
        setCoordinates({lat,long})
        setBtn("All")
      }
    })();
    
    setIntervalId = setInterval(() => {
      (async function () {
        const response = await axios.get("https://www.easybiztechnologies.shop/users");
        console.log("data from ", response);
        if (response.data.users) {
          setSquadData({squad:[...response.data.users],fil:[...response.data.users]});
          
        }
      })();
    }, 16000);

    return () => {
      clearInterval(setIntervalId);
    };

  //   axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=10.027349024206247,76.3081426797196&key=AIzaSyCn_LgN1lNiZpNfk5FReAj5CRTwiBo90lQ`)
  // .then(response => {
  //  console.log(response)
  //   const result = response.data.results[0];
  //   const locationName = result.formatted_address;
  //   console.log(locationName);
  // })
  // .catch(error => {
  //   console.error(error);
  // });
  },[])
  return (
    <div className="flex">
      {/* <Sidebar people={people} onPersonSelect={handlePersonSelect} /> */}

      <div className="w-[25vw] h-screen  shadow-2xl shadow-black px-5 flex flex-col items-center border-r-2 border-indigo-600">
        <div className="text-black font-semibold mt-5">KTracker</div>

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

      




      <div className="w-full flex justify-evenly my-4">

        <button  className={`${btn === "All" ? "border-2 px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
          setBtn("All")
        }}>All</button>
        <button  className={`${btn === "Active" ? "border-2 px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
          setBtn("Active")
        }}>Active</button>
        <button  className={`${btn === "Inactive" ? "border-2 px-4 py-1 rounded-md font-semibold" : "px-4 py-1 border-none"}`} onClick={()=>{
          setBtn("Inactive")
        }}>Inactive</button>
      </div>
        <div className="w-full  max-h-[80vh]  overflow-y-scroll overflow-x-hidden">
       
         
          
          
          {squadData.squad.map((data,index) =>{
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
            <div className="flex flex-col">
              <span>{data.officername}</span>
              <div className="flex items-center"><span className="mr-2">Active </span> <div className="w-3 h-3 bg-emerald-500 rounded-full"></div></div>
            </div>
           
          </div>
            )
          })}
         

        </div>
      </div>
      <iframe
        className="w-[75vw] h-screen"
        style={{ border: 0 }}

        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCn_LgN1lNiZpNfk5FReAj5CRTwiBo90lQ&q=${coordinates.lat},${coordinates.long}`}
        allowFullScreen
      ></iframe>

      <div className="w-[25vw] h-[25vh]  bg-slate-100 absolute bottom-0 right-0 shadow-xl px-16 py-5">
  

        

 

  <h1 className="text-xl font-bold">👮    {userData.officername}</h1>
        <h1 className="text-lg font-semibold">🚓    {userData.groupname}</h1>
        <h1 className="text-md font-semibold">📞    {userData.phone}</h1>
        <h1 className="text-md font-semibold">📅    {userData.date}</h1>
       
        <h1 className="text-md font-semibold">⌛   {userData.time}</h1>
      </div>
    </div>
  );
}