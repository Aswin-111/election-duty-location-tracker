import React, { useEffect,useState } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import { Stack, useRouter } from "expo-router";
import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'
import moment from 'moment'

const TASK_NAME = 'location-tracking';

function Dashboard() {
  const router = useRouter();


  





  
  const [logout,setOut] = useState(false)
  useEffect(() => {
    // Define the task outside the useEffect to avoid redefining it on each render
    TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
      if (error) {
        console.log('LOCATION_TRACKING task ERROR:', error);
        return;
      }
      if (data) {
        const { locations } = data;
        const location = locations[0];

        if (location) {
          const { latitude, longitude, speed, heading, accuracy } = location.coords;

          try {
            const currentTime = new Date();
            const currentOffset = currentTime.getTimezoneOffset();
            const ISTOffset = 330; // IST offset UTC +5:30
            const ISTTime = new Date(
              currentTime.getTime() + (ISTOffset + currentOffset) * 60000
            );

            const hoursIST = ISTTime.getHours();
            const minutesIST = ISTTime.getMinutes();
            let userdata = JSON.parse(await AsyncStorage.getItem("squaddata"));
            const response = await axios.post('https://www.easybiztechnologies.shop/updateusersdata', {
              date: moment().format("YYYY-MM-DD"),
              time: `${hoursIST}:${
                Number(minutesIST) === 59 ? "00" : Number(minutesIST) + 1
              }`,
              location: `${latitude},${longitude}`,
              id:userdata.id
            });

            const squaddata = await AsyncStorage.getItem("squaddata");
            if (squaddata) console.log(JSON.parse(squaddata));
          } catch (err) {
            console.log(err);
          }

          console.log(
            `${new Date(Date.now()).toLocaleString()}: ${latitude},${longitude} - Speed ${speed} - Precision ${accuracy} - Heading ${heading} `
          );
        }
      }
    });

    const startLocationTracking = async () => {
      const status = await Location.requestForegroundPermissionsAsync();
      if (status.status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000 * 60 * 1, 
        distanceInterval: 1,

        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Ktracker',
          notificationBody: 'Ktracker is running on your device',
        },

      });

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
      console.log('Tracking started', hasStarted);
    };

    startLocationTracking();
  }, []);

  return (
    <SafeAreaView>
    <Stack.Screen
      options={{
        headerShadowVisible: false,
        headerShown: false,
      }}
    />
   
        <View className="mt-16 w-full flex items-center px-5">
          <Text className="text-xl font-semibold">Ktracker</Text>

          <TouchableOpacity className="w-[55vw] h-[30vh] text-white mt-48 bg-[#43B8FF]  flex justify-center items-center border-4 border-[#57D877] rounded-full" onPress={
            () =>{
                
            
                

                setOut(true)
            }
          }>
            <Text className="font-semibold text-xl text-white">Turn Off</Text>
          </TouchableOpacity>
{logout &&
          <View className="w-full h-[100vh] absolute top-0 bottom-0 flex justify-center items-center ">
            <View className="w-full h-[30vh] bg-slate-300 absolute top-[30vh] rounded-lg ">
              <View className="w-full px-5 my-6">
                <Text className="text-xl font-semibold">Log out?</Text>
                <Text>Are you sure that you want to logout?</Text>
              </View>

              <View className="w-full flex flex-row justify-between px-5 relative top-[4vh]">
                <TouchableOpacity className="bg-red-400 w-24 py-3 flex justify-center items-center rounded-lg"
                onPress={
                    () =>{
                        setOut(false)
                    }
                  }>
                  <Text className="text-white font-semibold" >Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-400 w-24 py-3 flex justify-center items-center rounded-lg"
                  onPress={async function () {
                    try{
                     await Location.stopLocationUpdatesAsync(TASK_NAME);
                    await AsyncStorage.removeItem("squaddata");
                   router.push('/')
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
}
        </View>
      
    </SafeAreaView>
  )
}

export default Dashboard