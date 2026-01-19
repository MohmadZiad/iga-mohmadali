export interface MenuItem {
    condition: boolean;
    path: string;
    name: string;
    icon: string;
    selectedIcon: string;
    children: MenuItem[] | null;
}
