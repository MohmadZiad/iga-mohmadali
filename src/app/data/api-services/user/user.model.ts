import { UserDB } from './user.interface';
export default class User {
    userId: string;
    email: string;
    userAccountId: string;
    userName: string;
    accountCode: string;
    role: string;
    metadata: {
        fullName: string;
        phone: string;
    };

    constructor(user: UserDB) {
        this.email = user.email || 'Unknown';
        this.userId = user.user_id;
        this.userAccountId = user.user_account_id;
        this.userName = user.user_name;
        this.accountCode = user.account_code || '';
        this.metadata = { fullName: user.meta_data?.full_name || '', phone: user.meta_data?.phone || '' };

        // TODO: Update it after to implement user roles
        this.role = 'user';
    }

    get isAdmin() {
        return this.role === 'admin';
    }

    get fullName() {
        return this.metadata.fullName || this.email || '';
    }

    set fullName(fullName: string) {
        this.metadata.fullName = fullName;
    }

    get phone() {
        return this.metadata.phone;
    }

    set phone(phone: string) {
        this.metadata.phone = phone;
    }

    static createEmpty() {
        return new User({
            user_id: '',
            user_account_id: '',
            user_name: '',
            email: '',
            meta_data: {
                full_name: '',
                phone: '',
            },
        });
    }
}
