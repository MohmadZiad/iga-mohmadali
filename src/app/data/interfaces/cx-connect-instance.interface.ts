export interface CxConnectInstance {
    instanceId: string;
    instanceAlias: string;
    instanceStatus: string;
    instanceAccessUrl: string;
    inboundCallsEnabled: boolean;
    outboundCallsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CxConnectInstanceList = CxConnectInstance[];
