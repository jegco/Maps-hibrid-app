import { Component, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 Marker,
 CameraPosition
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';


declare var google: any; 


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	map: GoogleMap;
	autocomplete: any;
	autocompleteItems: any;
	GoogleAutocomplete: any;
	geocoder = new google.maps.Geocoder;
	markers = [];

  

  constructor(public navCtrl: NavController,
  	public googleMaps: GoogleMaps,
  	private platform: Platform,
  	public geolocation: Geolocation,
  	private zone: NgZone) {
  	platform.ready().then(() => {
      this.loadMap();
    });
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
	this.autocomplete = { input: '' };
	this.autocompleteItems = [];
  }


  loadMap(){
  let mapElement: HTMLElement = document.getElementById('map');


  this.geolocation.getCurrentPosition().then((position) =>{
  	let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create(mapElement, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.on(GoogleMapsEvent.MAP_READY)
      .subscribe(() => {
        console.log('Map is ready!');
        this.addMarkerToMap(position.coords.latitude, position.coords.longitude);
  });

      });
  }

  addMarkerToMap(latitude, longitude){
  	this.map.addMarker({
            title: 'Mi posicion actual',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: latitude,
              lng: longitude
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert("hola");
              });
          });
  }

  setLocation(){
  	if (this.autocomplete.input == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
	(predictions, status) => {
    this.autocompleteItems = [];
   		this.zone.run(() => {
      	predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    });
  });
  }

  selectSearchResult(item){
  this.autocompleteItems = [];

  this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
    if(status === 'OK' && results[0]){
      let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
      };
      //this.addMarkerToMap(position.lat, position.lng);
      //alert("entro al success places");
    }
  })
}

}
