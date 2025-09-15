import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import styles from './ExpenseChart.module.css'
import { formatCurrency } from '../utils/formatCurrency'


const COLORS = ["#FF6B6B","#4ECDC4","#45B7D1","#FFA600","#9B51E0","#7F8C8D"];

const ExpenseChart = ({expenses, currency, rates}) => {
  const chartData = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  },[]);

  if (chartData.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3>지출 분석</h3>
        <p className={styles.noDataText}>지출 내역을 추가하면 카테고리별 분석 차트가 여기에 표시됩니다.</p>
      </div>
    );
  }
  
  return (
    <div className={styles.chartContainer}>
      <h3>지출 분석</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value)=> formatCurrency(value, currency, rates)}/>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

};
export default ExpenseChart;
