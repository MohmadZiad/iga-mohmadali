import { MenuItem } from './menu-item.interface';

export interface SubMenu {
    subMenuHeader: string;
    subMenuItems: MenuItem[] | null;
}
