// Import required modules and services
import {Component} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-login',
    imports: [
        RouterLink // Allows router link usage in template
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    // Loading flag to show spinner or disable UI during login
    loading = false;

    // Inject AuthService to handle authentication
    constructor(private authService: AuthService) {
    }

    // Called when user clicks the login button
    login() {
        // Small delay to ensure loading UI updates
        setTimeout(() => {
            this.loading = true;
        }, 10);

        // Trigger Google login
        this.authService.login()
            .then((res) => {
                // Save login result and redirect
                this.authService.handleSignIn(res).then();
                this.loading = false;
            })
            .catch(error => {
                // Handle login failure
                this.loading = false;
                console.log("error::", error);
            });
    }
}
