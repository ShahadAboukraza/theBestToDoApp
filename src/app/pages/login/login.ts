import {Component} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
    imports: [
        RouterLink
    ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loading = false;

  constructor(private authService: AuthService) {
  }

  login() {
    setTimeout(() => {
      this.loading = true;
    }, 10);
    this.authService.login()
      .then((res) => {
        this.authService.handleSignIn(res).then();
        this.loading = false;
      }).catch(error => {
      this.loading = false;
      console.log("error::", error);
    });
  }
}
