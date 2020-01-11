import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {interval} from "rxjs";


@Injectable({
  providedIn: 'root'
})


export class LocationDataService {

  state: any =  [];
  constructor(
    private ajax: HttpClient
  ) { }

  getCityData(city_name){
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ city_name +"&key=AIzaSyBhFFhRFIIuZiB0ynXUDbHH_pjhZNGpj1E" ;
    return this.ajax.get(url)
  }

  getselectStateCitiesDetail(state) {
    this.state = []
    let vm = this;
    let ind = 1
    state.forEach(function (k) {
      vm.getCityData(k.City).subscribe((res : any) => {
        console.log('=====> ',res);
        if (res && res.results!='undefined' && res.results[0] && res.results[0].geometry.location && res.results[0].geometry) {
          let data= [k.City , res.results[0].geometry.location.lat,res.results[0].geometry.location.lng,ind++] ;
          vm.state.push(data);
        }
      })
    })
    console.log('----',this.state)
    return this.state;
  }
}
