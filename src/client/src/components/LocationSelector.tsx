import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const LocationSelector: React.FC = () => {
  const resultRef = useRef<HTMLPreElement>(null);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiamhtZWVsIiwiYSI6ImNseTZmeGkzNzA5bmwybHFyYzFrbGpwMnYifQ.zLf5q1bwCDE0msuYj8Evaw";

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: "country,region,place,postcode,locality,neighborhood,poi,poi.landmark",
      bbox: [2.691701, 4.240594, 14.577222, 13.865924], 
      marker: false,
    });

    const geocoderContainer = geocoderContainerRef.current;
    if (geocoderContainer && !geocoderContainer.firstChild) {
      geocoderContainer.appendChild(geocoder.onAdd());
    }

    const handleResult = (e: any) => {
      if (resultRef.current) {
        const coordinates = e.result.center;
        resultRef.current.innerText = `${coordinates[0]}, ${coordinates[1]}`;
      }
    };

    const handleClear = () => {
      if (resultRef.current) {
        resultRef.current.innerText = "";
      }
    };

    geocoder.on("result", handleResult);
    geocoder.on("clear", handleClear);

    return () => {
    
    
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div id="geocoder" ref={geocoderContainerRef} style={{ zIndex: 1, margin: "20px", }}></div>
      <pre id="result" ref={resultRef}></pre>
    </div>
  );
};

export default LocationSelector;
