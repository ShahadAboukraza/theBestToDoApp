// Import necessary Angular and Firebase modules
import {Injectable, signal} from '@angular/core';
import {Auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User} from "@angular/fire/auth";
import {Router} from '@angular/router';
import {LocalStorageService} from './local-storage.service';

// Marks this service as injectable and available app-wide
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Holds the currently authenticated user (not reactive)
    private _currentUser: User | null = null;

    // Reactive signal to track the user (useful in templates/components)
    $user = signal<User | null>(null);

    constructor(
        private auth: Auth, // Firebase Auth instance
        private router: Router, // Router for navigation
        private localStorageService: LocalStorageService, // Custom service to handle localStorage
    ) {
        // Load user from local storage and set it to the signal
        this.$user.set(this.loadUserFromStorage());

        // Subscribe to auth state changes (e.g., login/logout) and update _currentUser
        onAuthStateChanged(this.auth, user => this._currentUser = user);
    }

    // Getter to access the current user
    get currentUser(): User | null {
        return this._currentUser;
    }

    // Trigger Google sign-in popup
    login() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    // Sign out the user, clear local storage, and redirect to login
    logout() {
        signOut(this.auth).then(() => {
            localStorage.removeItem('u'); // Remove user data from storage
            this.router.navigate(['/login']).then(() => console.log('r')); // Navigate to login page
        }).catch((error) =>
            console.log(error)); // Log any sign-out error
    }

    // Load user object from local storage (if exists)
    private loadUserFromStorage(): User | null {
        const userData = this.localStorageService.getData('u');
        if (!userData) return null;
        return userData as unknown as User; // Cast stored data to User
    }

    // Handle sign-in credentials after login
    async handleSignIn(credential: any) {
        try {
            // Save user credential in local storage
            this.localStorageService.setData('u', credential);
            // Navigate to home page
            this.router.navigate(['']).then();
        } catch (error: unknown) {
            console.log(error); // Log error if something goes wrong
        }
    }
}
