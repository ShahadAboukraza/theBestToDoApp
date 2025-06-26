import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {map, take, tap} from 'rxjs';
import {AuthService} from '../services/auth-service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const afAuth = inject(AngularFireAuth);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!!authService.currentUser) {
    return true;
  } else {
    return afAuth.authState.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          router.navigate(['/login']).then();
        }
      })
    );
  }
};
