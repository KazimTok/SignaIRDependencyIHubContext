import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  baseUrl = "http://localhost:3807/api/Customer/";
  constructor(private httpClient: HttpClient) { }
  moveBlock(commandId: number, connectionId: string) {  
   let baseurl  =    this.baseUrl + `${commandId}/${connectionId}`;
    debugger; 
      this.httpClient.get(this.baseUrl + `${commandId}/${connectionId}`).subscribe((res) => {
        console.log("res : "+res);
        debugger;
          //console.log(`Move:${commandId}`);
      });
  }
}
