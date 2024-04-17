import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import moment from "moment";

import { Stack, useRouter } from "expo-router";


export default function App() {
  const [groupname, setGroupName] = useState("");
  const [officername, setOfficerName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter()



 useEffect(() =>{
    (async function () {
        try {
          if (JSON.parse(await AsyncStorage.getItem("squaddata"))) {
          return router.push('/dashboard')
          }



          
        }catch(err){
            console.log(err)
          }
        })()
    
    },[])

 

  return (
<SafeAreaView>
    <Stack.Screen
      options={{
        headerShadowVisible: false,
        headerShown: false,
      }}
    />
    <View className=" w-full h-screen ">
     
        <View className="mt-16 w-full flex items-center px-5">
          <Text className="text-2xl font-semibold">Ktracker</Text>
          <Text className="text-sm font-semibold text-indigo-400 my-5">
            You are opening the app for the first time
          </Text>

          <TextInput
            placeholder="Squad name"
            className="w-full mt-7 py-4 bg-slate-100 text-black font-semibold px-5 rounded-xl my-3"
            onChangeText={setGroupName}
          />
          <TextInput
            placeholder="Officer name"
            className="w-full py-4 bg-slate-100 text-black font-semibold px-5 rounded-xl my-3"
            onChangeText={setOfficerName}
          />
          <TextInput
            placeholder="Mobile Number"
            keyboardType="numeric"
            className="w-full py-4 bg-slate-100 text-black font-semibold px-5 rounded-xl my-3"
            onChangeText={setPhone}
          />

          <TouchableOpacity
            className="w-full py-4 bg-black rounded-xl flex items-center my-10"
            onPress={async function () {
              try {
                // Call the function to request location permission
                let { status } =
                  await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                  return;
                }

                let location = await Location.getCurrentPositionAsync({});
                console.log(location);

                let currentTime = new Date();

                let currentOffset = currentTime.getTimezoneOffset();

                let ISTOffset = 330; // IST offset UTC +5:30

                let ISTTime = new Date(
                  currentTime.getTime() + (ISTOffset + currentOffset) * 60000
                );

                // ISTTime now represents the time in IST coordinates

                let hoursIST = ISTTime.getHours();
                let minutesIST = ISTTime.getMinutes();

                const users = {
                  date: moment().format("YYYY-MM-DD"),
                  time: `${hoursIST}:${
                    Number(minutesIST) === 59 ? "00" : Number(minutesIST) + 1
                  }`,
                  groupname,
                  officername,
                  phone,

                  latlong: `${location.coords.latitude},${location.coords.longitude}`,
                };
                const response = await axios.post(
                  "https://www.easybiztechnologies.shop/init",
                  { ...users }
                );
                if (response.data.status) {
                  AsyncStorage.setItem(
                    "squaddata",
                    JSON.stringify({ groupname, officername,id:response.data.data.id })
                  );
                  
                  console.log(response.data.data,'data');

                  
                  return router.push('/dashboard')
                }
              } catch (err) {
                console.log("error", err);
              }
            }}
          >
            <Text className="text-white font-semibold">Intialise</Text>
          </TouchableOpacity>
        </View>
    </View>
    </SafeAreaView>
  );
}