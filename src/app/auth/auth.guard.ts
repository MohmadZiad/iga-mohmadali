import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../data/api-services/user/user.service';
import { FEATURES_FLAGS } from '../../environments/environments';

export const canActivateAuth = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    console.log('canActivateAuth', route);
    console.log('canActivateAuth', state);

    const publicRoutes = inject(AuthService).publicRoutes;
    const currentUrl = state.url;
    if (publicRoutes.includes(currentUrl)) {
        return true;
    }

    const isLoggedIn = inject(AuthService).isAuth;
    if (isLoggedIn) {
        return true;
    }

    return inject(Router).createUrlTree(['/login']);
};

export const canRootAccount = () => {
    const isRootAccountUser = inject(UserService).isRootAccountUser;
    if (isRootAccountUser) {
        return true;
    }
    return inject(Router).createUrlTree(['/']);
};

export const canAdminUser = () => {
    const authUser = inject(UserService).authUser;
    if (authUser?.isAdmin) {
        return true;
    }
    return inject(Router).createUrlTree(['/']);
};

export const canAccessByFeatureFlag = (route: ActivatedRouteSnapshot) => {
    if (route.data['featureFlagKey'] && !FEATURES_FLAGS[route.data['featureFlagKey'] as keyof typeof FEATURES_FLAGS]) {
        return inject(Router).createUrlTree(['/']);
    }
    return true;
};
