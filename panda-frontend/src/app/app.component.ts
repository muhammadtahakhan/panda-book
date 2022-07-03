import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalEventService } from './shared/_helpers/global-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pmex';
  constructor(private globalEvents:GlobalEventService, private _snackBar: MatSnackBar){
    this.globalEvents
                .on('serverMsg')
                .subscribe(
                        res=>{ console.log("message",res); this.openSnackBar(<string>res,'') },
                        
                );
}

openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, { duration: 5000,   horizontalPosition: "right",  verticalPosition: "top"});
}


}
