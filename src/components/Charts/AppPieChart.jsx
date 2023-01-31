import clsx from 'clsx';
import { Card } from 'react-bootstrap';
import { Pie, PieChart, Tooltip } from 'recharts';
import styles from './AppPieChart.module.css';

const AppPieChart = (props) => {
  if (props.data.length > 0) {
    return (
      <Card className={clsx(styles.card, props.className)}>
        <PieChart className={styles.chart} width={props.chartSize} height={props.chartSize}>
          <Pie
            dataKey={props.dataKey}
            data={props.data}
            cx="50%"
            cy="50%"
            fill="#0d6efd"
            label
          />
          <Tooltip />
        </PieChart>
        <Card.Title>{props.title}</Card.Title>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default AppPieChart;
