import { Component, computed, input } from '@angular/core';

import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams, CustomSeriesRenderItemReturn } from 'echarts';
import { CustomChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, GraphicComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

echarts.use([CustomChart, GridComponent, LegendComponent, CanvasRenderer, TooltipComponent, GraphicComponent]);

@Component({
    selector: 'app-chart-services-statistics',
    imports: [NgxEchartsDirective],

    templateUrl: './chart-services-statistics.component.html',
    styleUrl: './chart-services-statistics.component.scss',
    providers: [provideEchartsCore({ echarts })],
})
export class ChartServicesStatisticsComponent {
    data = input.required<[string, number, number, number][]>();
    dimensions = input<string[]>();
    dateRange = input<string>();

    options = computed<echarts.EChartsCoreOption>((): echarts.EChartsCoreOption => {
        return {
            legend: {
                selectedMode: false,
                data: [
                    {
                        name: 'الأكثر',
                        icon: 'circle',
                        itemStyle: {
                            color: '#308099',
                        },
                    },
                    {
                        name: 'الأقل',
                        icon: 'circle',
                        itemStyle: {
                            color: 'white',
                            borderWidth: 1,
                            borderColor: '#0D2646',
                        },
                    },
                    {
                        name: 'المتوسط',
                        icon: 'circle',
                        itemStyle: {
                            color: 'white',
                            borderWidth: 1,
                            borderColor: '#72A64A',
                        },
                    },
                ],
                icon: 'none',
            },
            // tooltip: {},
            xAxis: {
                axisLabel: {
                    fontSize: 10,
                    formatter: function (value: string) {
                        const maxLength = 10;
                        const parts = value.split(' ');
                        let result = '';
                        let line = '';
                        for (const part of parts) {
                            if (line.length + part.length > maxLength) {
                                result += line + '\n';
                                line = '';
                            }
                            line += part + ' ';
                        }
                        result += line.trim();
                        return result;
                    },
                },
                type: 'category',
                position: 'bottom',
                // axisTick: { alignWithLabel: true },
                axisLine: { onZero: false },
            },
            yAxis: {
                show: false,
                max: (value: { max: number; min: number }) => {
                    return value.max + 1;
                },
                min: (value: { max: number; min: number }) => {
                    return value.min - 2;
                },
            },
            grid: {
                bottom: 120,
                left: 5,
                right: 5,
            },
            series: [
                {
                    type: 'custom',
                    renderItem: this.renderItem,
                    dimensions: this.dimensions(),
                    encode: {
                        x: [0],
                        y: [1, 2, 3],
                        // tooltip: [1, 2, 3],
                    },
                    data: this.data(),
                    z: 100,
                },
                {
                    type: 'custom',
                    name: 'الأكثر',
                    renderItem: this.renderItem,
                },
                {
                    type: 'custom',
                    name: 'الأقل',
                    renderItem: this.renderItem,
                },
                {
                    type: 'custom',
                    name: 'المتوسط',
                    renderItem: this.renderItem,
                },
            ],
        };
    });

    private echartsInstance: echarts.ECharts | null = null;

    private renderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
        const group: CustomSeriesRenderItemReturn = {
            type: 'group',
            children: [],
        };
        const coordDims = ['x', 'y'];

        for (let baseDimIdx = 0; baseDimIdx < 2; baseDimIdx++) {
            const otherDimIdx = 1 - baseDimIdx;
            const encode = params.encode;
            const baseValue = api.value(encode[coordDims[baseDimIdx]][0]);
            const param = [];
            param[baseDimIdx] = baseValue;
            param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][1]);
            const highPoint = api.coord(param);
            param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][2]);
            const lowPoint = api.coord(param);
            param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][0]);
            const midPoint = api.coord(param);

            const makeShape = (baseDimIdx: number, base1: number, value1: number, base2: number, value2: number) => {
                const shape: Record<string, number> = {};
                shape[coordDims[baseDimIdx] + '1'] = base1;
                shape[coordDims[1 - baseDimIdx] + '1'] = value1;
                shape[coordDims[baseDimIdx] + '2'] = base2;
                shape[coordDims[1 - baseDimIdx] + '2'] = value2;
                return shape;
            };

            group.children.push({
                type: 'line',
                transition: ['shape'],
                shape: makeShape(
                    baseDimIdx,
                    highPoint[baseDimIdx],
                    highPoint[otherDimIdx],
                    lowPoint[baseDimIdx],
                    lowPoint[otherDimIdx]
                ),
                style: {
                    stroke: '#595959',
                    lineWidth: 3,
                },
            });

            if (!baseDimIdx) {
                group.children.push(
                    {
                        type: 'circle',
                        shape: {
                            cx: highPoint[0],
                            cy: highPoint[1],
                            r: 7,
                        },
                        style: {
                            fill: '#308099',
                        },
                    },
                    {
                        type: 'text',
                        style: {
                            text: `${api.value(encode[coordDims[otherDimIdx]][1])}`,
                            align: 'center',
                            verticalAlign: 'middle',
                            x: highPoint[0] + 15,
                            y: highPoint[1] - 12,
                            fill: '#308099',
                        },
                    },

                    {
                        type: 'circle',
                        shape: {
                            cx: lowPoint[0],
                            cy: lowPoint[1],
                            r: 7,
                        },
                        style: {
                            fill: 'white',
                            stroke: '#0D2646',
                        },
                    },
                    {
                        type: 'text',
                        style: {
                            text: `${api.value(encode[coordDims[otherDimIdx]][2])}`,
                            align: 'center',
                            verticalAlign: 'middle',
                            x: lowPoint[0] + 15,
                            y: lowPoint[1] + 12,
                            fill: '#0D2646',
                        },
                    },

                    {
                        type: 'circle',
                        shape: {
                            cx: midPoint[0],
                            cy: midPoint[1],
                            r: 7,
                        },
                        style: {
                            fill: 'white',
                            stroke: '#72A64A',
                        },
                    },
                    {
                        type: 'text',
                        style: {
                            text: `${api.value(encode[coordDims[otherDimIdx]][0])}`,
                            align: 'center',
                            verticalAlign: 'middle',
                            x: midPoint[0] + 15,
                            y: midPoint[1],
                            fill: '#72A64A',
                        },
                    }
                );
            }
        }

        return group;
    };

    onChartInit($event: echarts.ECharts) {
        this.echartsInstance = $event;
    }

    getChartDataURL(type: 'png' | 'jpeg' = 'png') {
        this.echartsInstance?.setOption({
            graphic: {
                type: 'text',
                left: 10,
                top: 10,
                style: {
                    text: this.dateRange(),
                    font: '12px sans-serif',
                    fill: '#999',
                },
                id: 'export-timestamp',
                z: 100,
            },
        });

        const linkImage = this.echartsInstance?.getDataURL({ type, backgroundColor: '#fff' });

        this.echartsInstance?.setOption({
            graphic: {
                id: 'export-timestamp',
                type: 'text',
                $action: 'remove',
            },
        });
        return linkImage;
    }
}
