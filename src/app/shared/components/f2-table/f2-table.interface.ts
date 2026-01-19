export interface F2TableColumnOption {
    label: string;
    key: string;
    unit?: string;
    isBig?: boolean;
    displayMode?: 'circleProgress' | 'accountName';
    color?: string;
}

export interface F2TableRowActions {
    name: string;
    icon: string;
    onClick: (item: any) => void;
}

export type F2TableData = Record<string, any>;
