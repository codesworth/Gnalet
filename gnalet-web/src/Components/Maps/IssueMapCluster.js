import React from "react";
import { Link } from "react-router-dom";
import { compose, withProps, withHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

//import {google} from "react-google-maps"

import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import {
  FIELD_CATEGORY,
  FIELD_LATITUDE,
  FIELD_LONGITUDE
} from "../../Helpers/Constants";

export const IssuesMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC1H_ydUlne75Uu7n4-F-JBBtyndZ7o0o8&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `80vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={12} defaultCenter={{ lat: 5.5557, lng: -0.19634 }}>
    {props.markers.map(marker => (
      <Marker
        key={marker.report.id}
        //options={{ icon: `../../img/${marker.ico}` }}
        title={marker.report[FIELD_CATEGORY]}
        icon={{
          url: marker.ico,
          scaledSize: new window.google.maps.Size(64, 64)
        }}
        position={{
          lat: marker.report.latitude,
          lng: marker.report.longitude
        }}
        onClick={() => props.openDetail(marker)}
      />
    ))}
    {props.activeMarker ? (
      <InfoWindow
        position={{
          lat: props.activeMarker.report[FIELD_LATITUDE],
          lng: props.activeMarker.report[FIELD_LONGITUDE]
        }}
        marker={props.activeMarker}
        visible={props.showingInfoWindow}
        //onCloseClick={() => props.openDetail(props.activeMarker)}
      >
        <div>
          <Link
            to="#"
            x={`/report/${props.activeMarker.report[FIELD_CATEGORY]}/${props.activeMarker.report.id}`}
            className="btn btn-secondary btn-sm"
          >
            {props.activeMarker
              ? props.activeMarker.report[FIELD_CATEGORY]
              : null}
            <i
              className="fas fa-arrow-circle-right"
              onClick={() => console.log("Hello World")}
            />
          </Link>
        </div>
      </InfoWindow>
    ) : null}
  </GoogleMap>
));

/*
export const MapWithAMarkerClusterer = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC1H_ydUlne75Uu7n4-F-JBBtyndZ7o0o8&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withHandlers({
    onMarkerClustererClick: () => markerClusterer => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap defaultZoom={12} defaultCenter={{ lat: 5.5557, lng: -0.19634 }}>
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map(marker => (
        <Marker
          key={marker.report.id}
          options={{ icon: `../../img/${marker.ico}` }}
          position={{
            lat: marker.report.latitude,
            lng: marker.report.longitude
          }}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>
));
*/
