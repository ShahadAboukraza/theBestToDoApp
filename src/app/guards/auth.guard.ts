// Import necessary Angular modules and RxJS operators
import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {map, take, tap} from 'rxjs';
import {AuthService} from '../services/auth-service';

// Define the authentication guard
export const AuthGuard: CanActivateFn = (route, state) => {
    const afAuth = inject(AngularFireAuth);       // Firebase auth instance
    const authService = inject(AuthService);      // Custom auth service
    const router = inject(Router);                // Router to redirect if needed

    // If user is already cached in authService, allow access
    if (!!authService.currentUser) {
        return true;
    } else {
        // Otherwise, check Firebase auth state (async)
        return afAuth.authState.pipe(
            take(1),                     // Take the first emitted auth state
            map(user => !!user),        // Convert user object to boolean
            tap(loggedIn => {
                // If not logged in, redirect to login page
                if (!loggedIn) {
                    router.navigate(['/login']).then();
                }
            })
        );
    }
};
