import { CxChannelEnum } from '../../data/enums/cx-channel.enum';

export const getChannelLabelMap = () => {
    return Object.values(CxChannelEnum).reduce(
        (acc, value) => {
            const label = value.charAt(0).toUpperCase() + value.slice(1);
            acc[value] = label;
            return acc;
        },
        {} as Record<string, string>
    );
};
