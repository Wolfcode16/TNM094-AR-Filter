
    // src/routes/analytics.jsx
import { useEffect, useState } from "react";
import { fetchRawData } from "@/data/chartDataService";
import Loader from "@/layouts/Loader";
import Plot from "react-plotly.js";
import { useTheme } from "@/hooks/use-theme";

const COLORS = ["#4a90e2", "#ab47bc", "#fbc02d", "#e57373"]; // Filter 1–4
const GRAY = "#cbd5e1"; // Not Interacted

const Analytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        fetchRawData().then((fetched) => {
            setData(fetched);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loader message="Analyzing interaction patterns..." />;
    if (!data || data.length === 0) return <p>No data available to show.</p>;




    const filterValues = data.map((item) => {
        const filter = (item.filters || [])[0];
        return filter >= 1 && filter <= 4 ? filter - 1 : NaN;
    });

    const parallelAxisData = {
        type: "parcoords",
        line: {
            color: filterValues,
            colorscale: [
                [0, '#e57373'],
                [0.25, '#fbc02d'],
                [0.75, '#ab47bc'],
                [1, '#4a90e2']
            ],
            cmin: 0,
            cmax: 3,
            showscale: false, 
        },
        dimensions: [
            {
                label: "Age",
                values: data.map((item) => Number(item.age) || NaN),
            },
            {
                label: "Gender",
                values: data.map((item) =>
                    item.gender?.toLowerCase() === "male" ? 0 : 1
                ),
                tickvals: [0, 1],
                ticktext: ["Male", "Female"],
                range: [0, 1],
            },
            {
                label: "Duration",
                values: data.map((item) => Number(item.duration) || NaN),
            },
            {
                label: "Interacted",
                values: data.map((item) => (item.interacted ? 1 : 0)),
                tickvals: [0, 1],
                ticktext: ["No", "Yes"],
                range: [0, 1],
            },
            {
                label: "Hand gestures",
                values: data.map((item) => (item.handGestures ? 1 : 0)),
                tickvals: [0, 1],
                ticktext: ["No", "Yes"],
                range: [0, 1],
            },
            {
                label: "Filter",
                values: filterValues,
                tickvals: [0, 1, 2, 3],
                ticktext: ["Filter 4", "Filter 3", "Filter 2", "Filter 1"],
                range: [0, 3],
            },
        ],
    };


    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Parallel Coordinates Plot
            </h1>

            <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-700 dark:text-slate-300">
                {[1, 2, 3, 4].map((filterVal, index) => (
                    <div key={filterVal} className="flex items-center gap-2">
                        <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <span>Filter {filterVal}</span>
                    </div>
                ))}
           
            </div>

            <Plot
                data={[parallelAxisData]}
                layout={{
                  
                    paper_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff",
                    plot_bgcolor: theme === "dark" ? "#1e293b" : "#ffffff",
                    font: {
                        color: theme === "dark" ? "#e2e8f0" : "#1e293b",
                    },
                    margin: { l: 50, r: 30, b: 50, t: 80 },
                }}
            />
        </div>
    );
};

export default Analytics;

