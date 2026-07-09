import {
 ResponsiveContainer,
 PieChart,
 Pie,
 Tooltip
} from "recharts";

function CategoryChart({data}:any){

return(

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={data}
dataKey="allocated"
nameKey="category"
outerRadius={100}
/>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

)

}

export default CategoryChart;