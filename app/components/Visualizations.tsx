import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';

// Define types for props
type WordCloudProps = {
    data: { text: string; value: number }[];
};

type TopicsPieChartProps = {
    data: { name: string; value: number }[];
};

type Visualization = {
    title: string;
    type: 'wordcloud' | 'pie';
    data: { [key: string]: string | number }[];
};

type VisualizationCardProps = {
    visualization: Visualization;
};

type VisualizationsProps = {
    visualizations: Visualization[];
};

// Custom color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d62728', '#9467bd'];

// WordCloud component using basic div + styling for visualization
const WordCloud: React.FC<WordCloudProps> = ({ data }) => {
    return (
        <div className="flex flex-wrap justify-center items-center gap-2 p-4 min-h-[200px]">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="text-center inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                    style={{
                        fontSize: `${Math.max(12, Math.min(24, item.value / 5))}px`,
                }}
                >
                    {item.text}
                </div>
            ))}
        </div>
    );
};

// TopicsPieChart component
const TopicsPieChart: React.FC<TopicsPieChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{ background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

// VisualizationCard component
const VisualizationCard: React.FC<VisualizationCardProps> = ({ visualization }) => {
    return (
        <Card className="p-4">
            <h3 className="font-bold mb-4">{visualization.title}</h3>
            {visualization.type === 'wordcloud' ? (
                <WordCloud data={visualization.data as WordCloudProps['data']} />
            ) : visualization.type === 'pie' ? (
                <TopicsPieChart data={visualization.data as TopicsPieChartProps['data']} />
            ) : null}
        </Card>
    );
};

// Visualizations component
const Visualizations: React.FC<VisualizationsProps> = ({ visualizations }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visualizations.map((viz, index) => (
                <VisualizationCard key={index} visualization={viz} />
            ))}
        </div>
    );
};

export default Visualizations;
