import {Inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import CryptoJS from "crypto-js";
import {environment} from '../../environment/environment';

function getLocalStorage() {
  return localStorage;
}

@Injectable({providedIn: 'root'})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<object>) {
  }

  get localStorage() {
    if (isPlatformBrowser(this.platformId)) {
      return getLocalStorage();
    }
    return null;
  }

  setData(key: string, data: unknown) {
    this.localStorage?.setItem(key, this.encryptData(data));
  }

  getData(key: string): string | null | undefined {
    const data = this.localStorage?.getItem(key);
    if (!data) return null;
    return JSON.parse(this.decryptData(data));
  }

  removeData(key: string) {
    this.localStorage?.removeItem(key);
  }

  private decryptData(data: string) {
    return CryptoJS.AES.decrypt(data, environment.firebaseConfig.appId).toString(CryptoJS.enc.Utf8);
  }

  private encryptData(data: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), environment.firebaseConfig.appId).toString();
  }
}
