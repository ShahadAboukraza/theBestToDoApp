// Import necessary Angular and utility modules
import {Inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import CryptoJS from "crypto-js"; // Library for encryption/decryption
import {environment} from '../../environment/environment';

// Utility to safely access `localStorage`
function getLocalStorage() {
    return localStorage;
}

// Make the service available globally
@Injectable({providedIn: 'root'})
export class LocalStorageService {
    // Inject the platform ID to check if we’re in the browser (not server-side)
    constructor(@Inject(PLATFORM_ID) private platformId: InjectionToken<object>) {
    }

    // Safely access localStorage only if running in the browser
    get localStorage() {
        if (isPlatformBrowser(this.platformId)) {
            return getLocalStorage();
        }
        return null;
    }

    // Encrypt and store data in localStorage under the given key
    setData(key: string, data: unknown) {
        this.localStorage?.setItem(key, this.encryptData(data));
    }

    // Retrieve and decrypt data from localStorage
    getData(key: string): string | null | undefined {
        const data = this.localStorage?.getItem(key);
        if (!data) return null;
        return JSON.parse(this.decryptData(data));
    }

    // Remove a key from localStorage
    removeData(key: string) {
        this.localStorage?.removeItem(key);
    }

    // Decrypt AES-encrypted string using the app ID as the key
    private decryptData(data: string) {
        return CryptoJS.AES.decrypt(data, environment.firebaseConfig.appId).toString(CryptoJS.enc.Utf8);
    }

    // Encrypt data as a string using AES with the app ID as the key
    private encryptData(data: any) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), environment.firebaseConfig.appId).toString();
    }
}
