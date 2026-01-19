import { CxChannelEnum } from '../enums/cx-channel.enum';
import { DateTime } from 'luxon';

export interface CxChannelDb {
    name: string;
    chat_id: string;
    api_key: string;
    channel: CxChannelEnum;
    channel_id: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
}

export interface CxChannel {
    name: string;
    chatId: string;
    apiKey: string;
    channel: CxChannelEnum;
    channelId: string;
    phoneNumber: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export type CxChannelList = CxChannel[];
