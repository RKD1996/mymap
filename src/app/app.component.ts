import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'

// map_api: AIzaSyBaS4VcxMUdoM5BXHSQsO2TVoAaYwAXVTs

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'mymap';
  state = 'Select State';
  city = 'Select City';
  cityData: any = {};
  stateCity: any = {};
  num: number = 1;
  map_address: any = encodeURI('https://maps.google.com/maps?q=bangalore&t=&z=6&ie=UTF8&iwloc=&output=embed');
  constructor (
    private ajax: HttpClient,
    private sanitize: DomSanitizer
  ) { }

  ngOnInit () {
    this.getData()
  }

  getData () {
    this.ajax.get('https://indian-cities-api-nocbegfhqg.now.sh/cities').subscribe( (res) => {
      this.stateCity = this.mapStateToCity(res);
    })
  }
  mapStateToCity(data){
    let state = {};
    for(let i in data)
     {
       let d = data[i];
       state[d.State] = "ok"
     }
    return state;
  }

  selectState (e) {
    this.state = e;
    this.ajax.get('https://indian-cities-api-nocbegfhqg.now.sh/cities?State_like=' + e).subscribe((res) => {
      this.cityData = res
    })
  }

  mapUrl (e: string): SafeResourceUrl {
    return this.sanitize.bypassSecurityTrustResourceUrl(e)
  }

  searchSelected () {
    if(this.num == 1) {
      this.num = 9;
    } else {
      this.num = 11;
    }
    // console.log(encodeURI('https://maps.google.com/maps?q=' + this.state + '+' + this.city +'&t=&z='+ this.num + '&ie=UTF8&iwloc=&output=embed'))
    this.map_address = encodeURI('https://maps.google.com/maps?q=' + this.state + '+' + this.city +'&t=&z='+ this.num + '&ie=UTF8&iwloc=&output=embed');
    this.num = 1;

  }

  selecCity (e) {
    this.num++;
    this.city = e;
    console.log(this.num)
  }
}
