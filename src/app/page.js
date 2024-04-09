"use client"
import { useEffect } from "react";


import axios from 'axios'
export default function Home() {
  
  // useEffect(()=>{
  //   axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=10.027349024206247,76.3081426797196&key=AIzaSyCn_LgN1lNiZpNfk5FReAj5CRTwiBo90lQ`)
  // .then(response => {
  //  console.log(response)
  //   // const result = response.data.results[0];
  //   // const locationName = result.formatted_address;
  //   // console.log(locationName);
  // })
  // .catch(error => {
  //   console.error(error);
  // });
  // },[])
  return (
    <div className="flex">
    {/* <Sidebar people={people} onPersonSelect={handlePersonSelect} /> */}
 

  <div className="w-[25vw] h-screen bg-slate-400 px-5 flex flex-col items-center">




<div className="text-white font-semibold mt-5">
  KTracker
</div>


<input placeholder="Search Officers" className="w-full  mt-5 py-3 px-4 rounded-md"/>
  </div>
<iframe
       className="w-[75vw] h-screen"
         style={{border:0}}
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCn_LgN1lNiZpNfk5FReAj5CRTwiBo90lQ&q=10.027349024206247,76.3081426797196`}
        allowFullScreen>
      </iframe>
    
  </div>
  );
}
