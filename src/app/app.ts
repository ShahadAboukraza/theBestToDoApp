import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, RouterLink, MatButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'

})
export class App {
  protected title = 'MyToDoapp';
}
