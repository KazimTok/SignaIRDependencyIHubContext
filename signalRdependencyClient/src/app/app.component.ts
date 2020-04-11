import { Component, ViewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { ServicesService } from './services.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'signalR Küp Oynatmaca';
  _hubConnection: HubConnection;
  _connectionId: string;
  signalRServiceIp: string = "http://localhost:3807/Animehub";

  SQUARE_SIZE: string = "50";
  MOVEMENT_STEP: string = "3";
  requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  direction: number = 12; // stop
  @ViewChild('square', { static: false }) square;

  public constructor(private service: ServicesService) { }

  public ngAfterViewInit() {
    //var square = document.getElementById("square");  
    this.square.nativeElement.style.top = "0";
    this.square.nativeElement.style.left = "0";
    this.square.nativeElement.style.height = this.SQUARE_SIZE;
    this.square.nativeElement.style.width = this.SQUARE_SIZE;
  }

  public ngOnInit(): void {
    let _direction: number = this.direction;

    var _this = this;

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.signalRServiceIp}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

      //connection başlatılır
    this._hubConnection.start().then(
      () => console.log("Hub Connection Start"))
      .catch(err => console.log(err));


      //servisten gelenn connectionID local değişkene atanır..
    this._hubConnection.on('GetConnectionId', (connectionId: string) => {
      this._connectionId = connectionId;
      console.log("ConnectionID :" + connectionId);
    });

    //yön tuşları ile işlem yapıldığında tuşun  ascii (hangi yön tuşuna bastığı) 
    //kodu ve connection Id alınır. işlem yapan connection Id değil ise bu portu dinleyen
    //bütün clientlere işlem gönderilir..
    this._hubConnection.on('MoveBlock', (commandId: number, connectionId: string) => {
      if (connectionId != _this._connectionId) {
        console.log("Move Block :" + commandId);
        this.direction = commandId;
        _this.requestAnimationFrame(_this.moveSquare.bind(_this));
      }
    });

    //yön tuşları ile işlem yapılarak moveblock ile portu dinleyen bütün clientlere işlm gönderilir.
    window.onkeydown = function (event) {
      if (event.keyCode >= 37 && event.keyCode <= 40) { 
        _this.direction = event.keyCode;
      }
      _this.requestAnimationFrame(_this.moveSquare.bind(_this));
      _this.service.moveBlock(_this.direction, _this._connectionId)
    };
  }


  public moveSquare(): void {
    var left = parseInt(this.square.nativeElement.style.left, 10);
    var top = parseInt(this.square.nativeElement.style.top, 10);
    var right = left + parseInt(this.SQUARE_SIZE);
    var bottom = top + parseInt(this.SQUARE_SIZE);
    console.log("Direction :" + this.direction);
    switch (this.direction) {
      case 37: // left
        if (left > 0) {
          this.square.nativeElement.style.left = left - parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      case 38: // up
        if (top > 0) {
          this.square.nativeElement.style.top = top - parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      case 39: //right
        if (right < document.documentElement.clientWidth) {
          this.square.nativeElement.style.left = left + parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      case 40: // down
        if (bottom < document.documentElement.clientHeight-80) {
          this.square.nativeElement.style.top = top + parseInt(this.MOVEMENT_STEP) + 'px';
          this.requestAnimationFrame(this.moveSquare.bind(this));
        }
        break;
      default:
        break;
    }
  }


}
