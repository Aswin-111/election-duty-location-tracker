import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import axios from "axios";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import BackgroundTask from "react-native-background-task";
import * as TaskManager from 'expo-task-manager';
import moment from "moment";
import { Stack,useRouter } from 'expo-router'

const TASK_NAME = 'location-tracking';

export default function App() {
  const [status, setStatus] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [groupname, setGroupName] = useState("");
  const [location, setLocation] = useState(null);
  const [officername, setOfficerName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter()

  useEffect(() => {
    (async function () {
      try {
        if (JSON.parse(await AsyncStorage.getItem("squaddata"))) {
          console.log(
            "data",
            JSON.parse(await AsyncStorage.getItem("squaddata"))
          );
          const config = async () => {
            let resf = await Location.requestForegroundPermissionsAsync();
            let resj = await Location.requestBackgroundPermissionsAsync();

            if (resf.status != 'granted' && resj.status !== 'granted') {
                console.log('Permission to access location was denied');
            } else {
                console.log('Permission to access location granted');
            }
        };

        config();
          setToggle(true);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (toggle) {
      // schedulePushNotification();
      // BackgroundTask.schedule();
    }
  }, [toggle]);

  useEffect(() => {
    TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
      console.log('Task called')

      if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error);
        return;
      }
      if (data) {
        const { locations } = data;
        let lat = locations[0].coords.latitude;
        let long = locations[0].coords.longitude;

        let speed = locations[0].coords.speed;
        let heading = locations[0].coords.heading;
        let accuracy = locations[0].coords.heading;

        try {
          let currentTime = new Date();

          let currentOffset = currentTime.getTimezoneOffset();

          let ISTOffset = 330; // IST offset UTC +5:30

          let ISTTime = new Date(
            currentTime.getTime() + (ISTOffset + currentOffset) * 60000
          );

          // ISTTime now represents the time in IST coordinates

          let hoursIST = ISTTime.getHours();
          let minutesIST = ISTTime.getMinutes();

          const response = await axios.post('http://192.168.1.5:5000/updateusersdata', {
            date: moment().format("YYYY-MM-DD"),
            time: `${hoursIST}:${
              Number(minutesIST) === 59 ? "00" : Number(minutesIST) + 1
            }`,

            location: `${lat},${long}`,
          });

          const squaddata = JSON.parse(await AsyncStorage.getItem("squaddata"));
          if (squaddata) console.log(squaddata);
        } catch (err) {
          console.log(err);
        }

        console.log(
          `${new Date(Date.now()).toLocaleString()}: ${lat},${long} - Speed ${speed} - Precision ${accuracy} - Heading ${heading} `
        );
      }
    });
  }, []);

  return (
    <View className=" w-full h-screen ">
      {!toggle ? (
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
                  "http://192.168.1.5:5000/init",
                  { ...users }
                );
                console.log(response.data);
                if (response.data.status) {
                  AsyncStorage.setItem(
                    "squaddata",
                    JSON.stringify({ groupname, officername })
                  );
                  const startLocationTracking = async () => {
                    await Location.startLocationUpdatesAsync(TASK_NAME, {
                      accuracy: Location.Accuracy.Highest,
                      timeInterval: 1000 * 60 * 1, // Update location every 5 minutes
                      distanceInterval: 1,

                      showsBackgroundLocationIndicator: true,
                      foregroundService: {
                        notificationTitle: 'Using your location',
                        notificationBody: 'To turn off, go back to the app and switch something off.',
                      },

                    });

                    const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
                    // setLocationStarted(hasStarted);
                    console.log('Tracking started', hasStarted);
                  };

                  startLocationTracking();

                  setToggle(true);
                }
              } catch (err) {
                console.log("error", err);
              }
            }}
          >
            <Text className="text-white font-semibold">Intialise</Text>
          </TouchableOpacity>
       
       
       <TouchableOpacity onPress = {
        ()=>{
          router.push('/dashboard')
        }
       }>
        <Text>Click</Text>
       </TouchableOpacity>
        </View>
      ) : (
        <View className="mt-16 w-full flex items-center px-5">
          <Text className="text-xl font-semibold">Ktracker</Text>

          <View className="w-[55vw] h-[30vh] text-white mt-48 bg-[#43B8FF]  flex justify-center items-center border-4 border-[#57D877] rounded-full">
            <Text className="font-semibold text-xl text-white">Turn Off</Text>
          </View>

          <View className="w-full h-[100vh] absolute top-0 bottom-0 flex justify-center items-center ">
            <View className="w-full h-[30vh] bg-slate-300 absolute top-[30vh] rounded-lg ">
              <View className="w-full px-5 my-6">
                <Text className="text-xl font-semibold">Log out?</Text>
                <Text>Are you sure that you want to logout?</Text>
              </View>

              <View className="w-full flex flex-row justify-between px-5 relative top-[4vh]">
                <TouchableOpacity className="bg-red-400 w-24 py-3 flex justify-center items-center rounded-lg">
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-400 w-24 py-3 flex justify-center items-center rounded-lg"
                  onPress={async function () {
                    try{
                    // await Location.stopLocationUpdatesAsync(TASK_NAME);
                    await AsyncStorage.removeItem("squaddata");
                    setToggle(false);
                    }
                    catch(err){
                      console.log(err)
                    
                    }
                  }}
                >
                  <Text className="text-white font-semibold">Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}