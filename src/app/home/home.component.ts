import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LocationDataService } from '../location-data.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  loader = false;

  title = 'mymap';
  state = 'Select State';
  city = 'Select City';
  cityData: any = {};
  stateCity: any = {};
  num: number = 1;
  map: google.maps.Map;

  constructor (
    private ajax: HttpClient,
    private locaDoc: LocationDataService
  ) { }

  ngOnInit () {
    this.loader = true;
    this.getStatesDetails()
  }
  markMultipleCityOnMap(e){
    this.loader = true
    let locations = e
      console.log('location -- ',locations)

    let stateLoc = this.locaDoc.getCityData(this.state).subscribe<any>(res => {
      console.log('res -- ',res)
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: new google.maps.LatLng(res.results[0].geometry.location.lat,res.results[0].geometry.location.lng),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        let infowindow = new google.maps.InfoWindow();

        let marker, i;

        for (i = 0; i < locations.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
    })
    this.loader = false
  }

  getStatesDetails () {
    this.ajax.get('https://indian-cities-api-nocbegfhqg.now.sh/cities').subscribe<any>( res => {
      this.stateCity = this.mapStateToCity(res);
      this.loader = false
    })
  }

  mapStateToCity(data){
    let state = {};
    for(let i in data)
     {
       let d = data[i];
       state[d.State] = ''
     }
    return state;
  }

  getselectStateCitiesDetails (e) {
    this.loader = true
    this.state = e;
    this.city = 'Select City';
    this.cityData =[]
    this.ajax.get('https://indian-cities-api-nocbegfhqg.now.sh/cities?State_like=' + e).subscribe<any>((res) => {
      this.cityData = this.locaDoc.getselectStateCitiesDetail(res)
      setTimeout(() => {
        this.markMultipleCityOnMap(this.cityData)
      }, 1000)
    })
    this.loader = false
  }

  selecCity (e) {
    this.loader = true
    this.city = e;
    this.locaDoc.getCityData(e).subscribe<any>(res => {
      this.markMultipleCityOnMap([[e , res.results[0].geometry.location.lat,res.results[0].geometry.location.lng,1]]);
    })
    this.loader = false
  }

}
