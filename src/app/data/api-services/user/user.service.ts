import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUser, UserDB } from './user.interface';
import User from './user.model';
import { map, tap } from 'rxjs';
import { API_URL, ROOT_ACCOUNT } from '../../../../environments/environments';
import { AuthService } from '../../../auth/auth.service';

export { User };

export interface UserMetaData {
    fullName: string;
    phone?: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    private user = User.createEmpty();

    get authUser() {
        return this.user;
    }

    get isRootAccountUser() {
        return this.user?.userAccountId === ROOT_ACCOUNT;
    }

    get() {
        const authUser = this.authService.authUser as AuthUser;

        const url = `${API_URL}/user`;
        const options = {
            params: {
                select: '*,...accounts(account_code)',
                user_id: 'eq.' + authUser.id,
            },
        };
        return this.http.get<UserDB[]>(url, options).pipe(
            map((user) => {
                user[0].email = authUser.email;
                return new User(user[0]);
            }),
            tap((user) => {
                this.user = user;
            })
        );
    }

    update(metaData: UserMetaData) {
        console.log('UserService -> updateUser');
        const url = `${API_URL}/user`;
        const body = {
            meta_data: {
                full_name: metaData.fullName,
                phone: metaData.phone,
            },
        };
        return this.http.patch(url, body).pipe(
            tap(() => {
                this.user.fullName = metaData.fullName;
                this.user.phone = metaData.phone || '';
            })
        );
    }
}
