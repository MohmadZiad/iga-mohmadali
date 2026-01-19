import { calculatePercentage, getColorByStatus } from '../../../../shared/utils/general.utils';
import { OrderStatisticsDB } from '../order.interface';

export class OrderStatistics {
    total: number;

    approvalDependencies: number;
    electronicCount: number;
    inPersonCount: number;

    individualCount: number;
    businessOwnerCount: number;

    rejected: number;
    rejectedRate: number;
    completed: number;
    completedRate: number;
    returned: number;
    cancelled: number;
    returnedRate: number;
    inProgress: number;
    inProgressRate: number;
    completedWithinSla: number;

    complianceRate: number;
    individualRate: number;
    businessOwnerRate: number;
    electronicRate: number;
    inPersonRate: number;
    approvalDependenciesRate: number;

    constructor(res: OrderStatisticsDB | Record<string, any>) {
        this.total = Number(res.total || 0);
        this.rejected = Number(res.rejected || 0);
        this.cancelled = Number(res.cancelled || 0);
        this.completed = Number(res.completed || 0);
        this.returned = Number(res.returned || 0);
        this.inProgress = Number(res.in_progress || 0);
        this.completedWithinSla = Number(res.completed_within_sla || 0);

        this.approvalDependencies = Number(res.approval_dependencies || 0);

        this.electronicCount = Number(res.electronic_count || 0);
        this.inPersonCount = Number(res.in_person_count || 0);
        this.individualCount = Number(res.individual_count || 0);
        this.businessOwnerCount = Number(res.business_owner_count || 0);

        this.rejectedRate = calculatePercentage(this.rejected, this.total);
        this.completedRate = calculatePercentage(this.completed, this.total);
        this.returnedRate = calculatePercentage(this.returned, this.total);
        this.inProgressRate = calculatePercentage(this.inProgress, this.total);
        this.complianceRate = calculatePercentage(this.completedWithinSla, this.completed);

        this.individualRate = calculatePercentage(this.individualCount, this.total);
        this.businessOwnerRate = calculatePercentage(this.businessOwnerCount, this.total);
        this.electronicRate = calculatePercentage(this.electronicCount, this.total);
        this.inPersonRate = calculatePercentage(this.inPersonCount, this.total);
        this.approvalDependenciesRate = calculatePercentage(this.approvalDependencies, this.total);
    }

    getPerformances() {
        return [
            {
                key: 'individual',
                rate: this.individualRate,
                count: this.individualCount,
            },
            {
                key: 'businessOwner',
                rate: this.businessOwnerRate,
                count: this.businessOwnerCount,
            },
            {
                key: 'electronic',
                rate: this.electronicRate,
                count: this.electronicCount,
            },
            {
                key: 'inPerson',
                rate: this.inPersonRate,
                count: this.inPersonCount,
            },
            {
                key: 'approvalDependencies',
                rate: this.approvalDependenciesRate,
                count: this.approvalDependencies,
            },
        ];
    }

    getIndicators() {
        return {
            rejected: {
                rate: this.rejectedRate,
                count: this.rejected,
                color: getColorByStatus('rejected'),
            },
            // TODO: Need approve and new design for new status order
            // cancelled: {
            //     rate: calculatePercentage(this.cancelled, this.total),
            //     count: this.cancelled,
            //     color: getColorByStatus('cancelled'),
            // },
            completed: {
                rate: this.completedRate,
                count: this.completed,
                color: getColorByStatus('executed/complete'),
            },
            returned: {
                rate: this.returnedRate,
                count: this.returned,
                color: getColorByStatus('returned'),
            },
            inProgress: {
                rate: this.inProgressRate,
                count: this.inProgress,
                color: getColorByStatus('in_progress'),
            },
        };
    }
}
