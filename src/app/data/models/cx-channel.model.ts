import { DateTime } from 'luxon';
import { CxChannel, CxChannelDb } from '../interfaces/cx-channel.interface';
import { CxChannelEnum } from '../enums/cx-channel.enum';

export class CxChannelModel implements CxChannel {
    name: string;
    apiKey: string;
    chatId: string;
    channelId: string;
    phoneNumber: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    channel: CxChannelEnum;

    constructor(data: Partial<CxChannel>) {
        this.name = data.name!;
        this.chatId = data.chatId!;
        this.apiKey = data.apiKey!;
        this.channel = data.channel!;
        this.channelId = data.channelId!;
        this.phoneNumber = data.phoneNumber!;
        this.createdAt = data.createdAt!;
        this.updatedAt = data.updatedAt!;
    }

    static parseDb(data: CxChannelDb): CxChannel {
        return new CxChannelModel({
            name: data.name,
            chatId: data.chat_id,
            apiKey: data.api_key,
            channel: data.channel,
            channelId: data.channel_id,
            phoneNumber: data.phone_number,
            createdAt: DateTime.fromISO(data.created_at),
            updatedAt: DateTime.fromISO(data.updated_at),
        });
    }
}
