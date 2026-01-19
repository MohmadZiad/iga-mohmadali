import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { API_URL } from '../../../environments/environments';
import { BaseF2ApiResponse } from '../interfaces/base-api-response.interface';
import { isApiErrorStatusCode } from '../../shared/utils/http.utils';

@Injectable({
    providedIn: 'root',
})
export class KpiNotificationService {
    http = inject(HttpClient);

    sendReminderAboutMissingServices(reportId: string): Observable<string> {
        const url = `${API_URL}/send/notification`;

        return this.http.post<BaseF2ApiResponse>(url, { notificationType: 'reminderMissedServices', reportId }).pipe(
            map((res: BaseF2ApiResponse) => {
                try {
                    const { body, statusCode } = res;
                    const parsedBody = JSON.parse(body || '{}');

                    if (isApiErrorStatusCode(statusCode)) {
                        console.error('sendReminderAboutMissingServices:', parsedBody.message || 'Unknown error');
                        return 'Success';
                    }

                    return 'Success';
                } catch (e) {
                    console.error('sendReminderAboutMissingServices: JSON parsing error', e);
                    return 'Success';
                }
            }),
            catchError((err) => {
                console.log('err :>> ', err);
                const customError = new Error(
                    `Report was uploaded successfully, but failed to send notification about missed services.`
                );
                return throwError(() => customError);
            })
        );
    }
}
