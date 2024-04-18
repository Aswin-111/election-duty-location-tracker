"use client"
import React, { useEffect, useRef } from "react";
import Head from 'next/head'
function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      // Initialize the map
      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
        });

        // Define the polygon coordinates
        const polygonCoordinates = [
          { lat: 40.7128, lng: -74.0060 },
          { lat: 40.7128, lng: -73.9900 },
          { lat: 40.7000, lng: -73.9900 },
          { lat: 40.7000, lng: -74.0060 },
        ];

        // Create the polygon
        const polygon = new window.google.maps.Polygon({
          paths: polygonCoordinates,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });

        // Add the polygon to the map
        polygon.setMap(map);

        // Check if the user location is inside the polygon
        const userLocation = { lat: 40.7050, lng: -73.9950 };
        const isInside = window.google.maps.geometry.poly.containsLocation(userLocation, polygon);

        if (isInside) {
          console.log("The user is inside the polygon.");
        } else {
          console.log("The user is outside the polygon.");
        }
      }
    };

    if (!window.google || !window.google.maps) {
      // Google Maps script hasn't loaded yet, wait and try again
      const waitForGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(waitForGoogleMaps);
          initializeMap();
        }
      }, 100);
    } else {
      // Google Maps script is already loaded, initialize the map
      initializeMap();
    }
  }, []);

  return (
    <div id="map" style={{ height: '500px', width: '100%' }} ref={mapRef}></div>
  );
}

function Home() {
  return (
    <div>
      <Head>
        <title>Geofencing Example</title>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCn_LgN1lNiZpNfk5FReAj5CRTwiBo90lQ&libraries=geometry`}
          async
          defer
        />
      </Head>
      <Map />
    </div>
  );
}

export default Home;