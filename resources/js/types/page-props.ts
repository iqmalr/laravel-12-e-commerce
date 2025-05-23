// resources/js/types/page-props.ts
import { User } from './user';

export interface PageProps<T = object> {
    auth: {
        user: User;
    };
    props?: T;
    [key: string]: unknown;
}
