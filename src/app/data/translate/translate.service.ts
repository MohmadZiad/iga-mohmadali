import { Injectable, signal } from '@angular/core';

import * as en from './i18n/en.json';
import * as ar from './i18n/ar.json';

@Injectable({
    providedIn: 'root',
})
export class TranslateService {
    private locales: Record<string, Record<string, string>> = { en, ar };
    selectedLocale = signal<'ar' | 'en'>('ar');

    getValue(key: string): string {
        return this.locales[this.selectedLocale()]?.[key] || key;
    }
}
