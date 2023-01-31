import { Card } from 'react-bootstrap';
import styles from './Highlight.module.css';

const Highlight = (props) => {
  const matches = props.matches.map((match) => match.matchedText);

  const textSplit = props.text
    .split(new RegExp(`(${matches.join('|')})`, 'gi'))
    .filter((text) => text !== '');

  return (
    <span>
      {textSplit.map((text, index) => {
        if (matches.includes(text)) {
          const types = props.matches.find((match) => match.matchedText === text).types;

          return (
            <div key={index} className={styles.outer}>
              <b>
                <u>{text}</u>
              </b>
              {types.length > 0 ? (
                <Card className={styles.inner}>
                  {types.join(', ')}
                </Card>
              ) : ''}
            </div>
          );
        } else {
          return text;
        }
      })}
    </span>
  );
};

export default Highlight;
