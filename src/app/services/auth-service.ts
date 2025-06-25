import {Injectable, signal} from '@angular/core';
import {Auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User} from "@angular/fire/auth";
import {Router} from '@angular/router';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser: User | null = null;
  $user = signal<User | null>(null);

  constructor(private auth: Auth, private router: Router,
              private localStorageService: LocalStorageService,
  ) {
    this.$user.set(this.loadUserFromStorage());
    onAuthStateChanged(this.auth, user => this._currentUser = user);
  }

  get currentUser(): User | null {
    return this._currentUser;
  }

  login() {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(this.auth, provider)
  }

  logout() {
    signOut(this.auth).then(() => {
      localStorage.removeItem('u');
      this.router.navigate(['/']).then();
    }).catch((error) =>
      console.log(error));
  }

  private loadUserFromStorage(): User | null {
    const userData = this.localStorageService.getData('u');
    if (!userData) return null;
    return userData as unknown as User
  }

  async handleSignIn(credential: any) {
    try {
      this.localStorageService.setData('u', credential);
      this.router.navigate(['']).then();
    } catch (error: unknown) {
      console.log(error)
    }
  }


}
