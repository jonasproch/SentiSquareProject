import clsx from 'clsx';
import { Card } from 'react-bootstrap';
import { Bar, BarChart, Tooltip, XAxis } from 'recharts';
import styles from './AppBarChart.module.css';

const AppBarChart = (props) => {
  if (props.data.length > 0) {
    return (
      <Card className={clsx(styles.card, props.className)}>
        <BarChart
          className={styles.chart}
          width={props.chartSize}
          height={props.chartSize}
          data={props.data}
        >
          <XAxis dataKey={props.dataKeyX} />
          <Tooltip />
          <Bar dataKey={props.dataKeyY} cx="50%" cy="50%" fill="#0d6efd" />
        </BarChart>
        <Card.Title>{props.title}</Card.Title>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default AppBarChart;
