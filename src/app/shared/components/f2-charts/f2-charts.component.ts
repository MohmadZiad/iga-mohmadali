import { Component, computed, input, output } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
// import echarts core
import * as echarts from 'echarts/core';
// import necessary echarts components
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, GridComponent, LegendComponent, TitleComponent, CanvasRenderer, TooltipComponent]);

export type ChartDataItemType = (string | number)[];

export interface ItemChart {
    serviceCode: string;
    accountId: string;
}

@Component({
    selector: 'app-f2-charts',
    imports: [NgxEchartsDirective],
    templateUrl: './f2-charts.component.html',
    styleUrl: './f2-charts.component.scss',
    providers: [provideEchartsCore({ echarts })],
})
export class F2ChartsComponent {
    data = input<ChartDataItemType[]>([]);
    color = input<string>('#4a61a8');
    dimensions = input<string[]>(['name', 'value']);
    barHeight = input<number>(30);

    // حساب الارتفاع الديناميكي بناءً على عدد العناصر
    chartHeight = computed(() => {
        const itemCount = this.data().length;
        const minHeight = 200;
        const calculatedHeight = itemCount * (this.barHeight() + 15) + 80;
        return Math.max(minHeight, calculatedHeight);
    });

    clickToChart = output<ItemChart>();

    private echartsInstance: echarts.ECharts | null = null;

    onChartInit($event: echarts.ECharts) {
        this.echartsInstance = $event;
        this.echartsInstance.on('click', (params) => {
            if (Array.isArray(params.data)) {
                const [name, value, serviceCode, accountId] = params.data;
                console.log(name, value);
                this.clickToChart.emit({ serviceCode: serviceCode?.toString() || '', accountId: accountId?.toString() || '' });
            }
        });
    }

    getChartDataURL(type: 'png' | 'jpeg' | 'svg' = 'png') {
        return this.echartsInstance?.getDataURL({ type, backgroundColor: '#fff' });
    }

    chartOption = computed<echarts.EChartsCoreOption>(() => {
        const barHeightValue = this.barHeight();
        return {
            color: this.color(),
            tooltip: {
                confine: true,
                formatter: (params: any) => {
                    return `
                        <div style="color: #72A64A; border-bottom: 1px solid #999999">${params.dimensionNames[1]}</div>
                        <div style="color: #D5A520; border-bottom: 1px solid #999999">${params.dimensionNames[0]}</div>
                        <div style="color: #72A64A">${params.value[1]}</div>
                        <div>${params.value[0]}</div>
                    `;
                },
                extraCssText: `
                    border-radius: 10px;
                    display: grid;
                    gap: 5px;
                    grid-template-columns: 70px 200px;
                    text-align: center;
                    align-items: center;
                    text-wrap: wrap;
                    white-space: normal;
                `,
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#E5E5E5',
                    },
                },
            },
            yAxis: {
                type: 'category',
                inverse: true,
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                nameTextStyle: {
                    fontSize: 13,
                    color: '#666',
                    padding: [0, 0, 0, 10],
                },
                name: 'اسم الخدمة',
                nameLocation: 'middle',
                nameGap: 25,
            },
            grid: {
                top: 20,
                bottom: 30,
                left: 50,
                right: 20,
                containLabel: false,
            },
            series: [
                {
                    label: {
                        show: true,
                        position: 'insideRight',
                        color: '#000000',
                        fontSize: 12,
                        formatter: (params: any) => {
                            const name = params.name.trim();
                            return name.length > 40 ? name.substring(0, 40) + '...' : name;
                        },
                    },
                    encode: {
                        x: 1,
                        y: 0,
                    },
                    barCategoryGap: 8,
                    barMaxWidth: barHeightValue,
                    barMinWidth: barHeightValue - 5,
                    type: 'bar',
                    data: this.data(),
                    dimensions: this.dimensions(),
                    itemStyle: {
                        borderRadius: [0, 4, 4, 0],
                    },
                },
            ],
        };
    });
}
