'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

const Chart = RechartsPrimitive.ResponsiveContainer;

const ChartArea = React.forwardRef<
  RechartsPrimitive.ReferenceArea,
  RechartsPrimitive.AreaProps
>((props, ref) => <RechartsPrimitive.Area ref={ref} {...props} />);
)
ChartArea.displayName = 'ChartArea';

const ChartBar = React.forwardRef<
  RechartsPrimitive.ReferenceArea,
  RechartsPrimitive.BarProps
>((props, ref) => <RechartsPrimitive.Bar ref={ref} {...props} />);
)
ChartBar.displayName = 'ChartBar';

const ChartLine = React.forwardRef<
  RechartsPrimitive.Line,
  RechartsPrimitive.LineProps
>((props, ref) => <RechartsPrimitive.Line ref={ref} {...props} />);
)
ChartLine.displayName = 'ChartLine';

const ChartXAxis = React.forwardRef<
  RechartsPrimitive.XAxis,
  RechartsPrimitive.XAxisProps
>((props, ref) => (
  <RechartsPrimitive.XAxis
    ref={ref}
    {...props}
    tick={{ fill: 'hsl(var(--foreground))' }}
  />
));
ChartXAxis.displayName = 'ChartXAxis';

const ChartYAxis = React.forwardRef<
  RechartsPrimitive.YAxis,
  RechartsPrimitive.YAxisProps
>((props, ref) => (
  <RechartsPrimitive.YAxis
    ref={ref}
    {...props}
    tick={{ fill: 'hsl(var(--foreground))' }}
  />
));
ChartYAxis.displayName = 'ChartYAxis';

const ChartTooltip = React.forwardRef<
  RechartsPrimitive.Tooltip,
  RechartsPrimitive.TooltipProps
>((props, ref) => (
  <RechartsPrimitive.Tooltip
    ref={ref}
    {...props}
    contentStyle={{
      backgroundColor: 'hsl(var(--background))',
      border: '1px solid hsl(var(--border))',
      borderRadius: 'var(--radius)',
    }}
    labelStyle={{ color: 'hsl(var(--foreground))' }}
  />
));
ChartTooltip.displayName = 'ChartTooltip';

const ChartLegend = React.forwardRef<
  RechartsPrimitive.Legend,
  RechartsPrimitive.LegendProps
>((props, ref) => (
  <RechartsPrimitive.Legend
    ref={ref}
    {...props}
    wrapperStyle={{
      color: 'hsl(var(--foreground))',
    }}
  />
));
ChartLegend.displayName = 'ChartLegend';

const ChartCartesianGrid = React.forwardRef<
  RechartsPrimitive.CartesianGrid,
  RechartsPrimitive.CartesianGridProps
>((props, ref) => (
  <RechartsPrimitive.CartesianGrid
    ref={ref}
    {...props}
    strokeDasharray="3 3"
    stroke="hsl(var(--muted-foreground))"
    strokeOpacity={0.2}
  />
));
ChartCartesianGrid.displayName = 'ChartCartesianGrid';

const ChartPie = React.forwardRef<
  RechartsPrimitive.Pie,
  RechartsPrimitive.PieProps
>((props, ref) => <RechartsPrimitive.Pie ref={ref} {...props} />);
)
ChartPie.displayName = 'ChartPie';

const ChartScatter = React.forwardRef<
  RechartsPrimitive.Scatter,
  RechartsPrimitive.ScatterProps
>((props, ref) => <RechartsPrimitive.Scatter ref={ref} {...props} />);
)
ChartScatter.displayName = 'ChartScatter';

const ChartComposedChart = React.forwardRef<
  RechartsPrimitive.ComposedChart,
  RechartsPrimitive.ComposedChartProps
>((props, ref) => <RechartsPrimitive.ComposedChart ref={ref} {...props} />);
)
ChartComposedChart.displayName = 'ChartComposedChart';

const ChartLineChart = React.forwardRef<
  RechartsPrimitive.LineChart,
  RechartsPrimitive.LineChartProps
>((props, ref) => <RechartsPrimitive.LineChart ref={ref} {...props} />);
)
ChartLineChart.displayName = 'ChartLineChart';

const ChartBarChart = React.forwardRef<
  RechartsPrimitive.BarChart,
  RechartsPrimitive.BarChartProps
>((props, ref) => <RechartsPrimitive.BarChart ref={ref} {...props} />);
)
ChartBarChart.displayName = 'ChartBarChart';

const ChartPieChart = React.forwardRef<
  RechartsPrimitive.PieChart,
  RechartsPrimitive.PieChartProps
>((props, ref) => <RechartsPrimitive.PieChart ref={ref} {...props} />);
)
ChartPieChart.displayName = 'ChartPieChart';

const ChartScatterChart = React.forwardRef<
  RechartsPrimitive.ScatterChart,
  RechartsPrimitive.ScatterChartProps
>((props, ref) => <RechartsPrimitive.ScatterChart ref={ref} {...props} />);
)
ChartScatterChart.displayName = 'ChartScatterChart';

export {
  Chart,
  ChartArea,
  ChartBar,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartCartesianGrid,
  ChartPie,
  ChartScatter,
  ChartComposedChart,
  ChartLineChart,
  ChartBarChart,
  ChartPieChart,
  ChartScatterChart,
};