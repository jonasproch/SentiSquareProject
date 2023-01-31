import { useState } from 'react';
import styles from './App.module.css';
import FileUpload from './components/FileUpload';
import Highlight from './components/Highlight';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import AppPieChart from './components/Charts/AppPieChart';
import AppBarChart from './components/Charts/AppBarChart';
import useReadTextFile from './hooks/useReadTextFile';
import useFetch from './hooks/useFetch';

const App = () => {
  const [fileLinesData, setFileLinesData] = useState([]);
  const [typeFrequencyData, setTypeFrequencyData] = useState([]);
  const [wordCountFrequency, setWordCountFrequency] = useState([]);
  const [numOfTypesData, setNumOfTypesData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [readFile] = useReadTextFile();
  const { fetchData } = useFetch('http://localhost:4567/', { method: 'POST' });

  const processFile = (file) => {
    readFile(
      file,
      (line) => {
        return { text: line, entities: [] };
      },
      setFileLinesData
    );
  };

  const clearData = () => {
    setFileLinesData([]);
    setTypeFrequencyData([]);
    setWordCountFrequency([]);
    setNumOfTypesData([]);
  };

  const fileConfirmHandler = async () => {
    setLoading(true);
    const newFileLinesData = await Promise.all(
      fileLinesData.map(async (line) => {
        const res = await fetchData({
          extractors: 'entities',
          text: line.text,
        });
        if (res.ok) {
          return {
            text: line.text,
            entities: res.response.entities ? res.response.entities.map((entity) => {
              return {
                entityId: entity.entityId,
                matchedText: entity.matchedText,
                types: entity.type ?? [],
              };
            }) : [],
          };
        } else {
          return {
            text: line.text,
            entities: [],
          };
        }
      })
    );

    const newTypeFrequencyData = [];
    const newWordCountFrequencyData = [];
    const newNumOfTypesData = [];

    newFileLinesData.forEach((lineData) => {
      lineData.entities.forEach((entity) => {
        // Data for frequency data transform
        entity.types.forEach((type) => {
          if (!newTypeFrequencyData.some((data) => data.name === type)) {
            newTypeFrequencyData.push({ name: type, count: 1 });
          } else {
            const index = newTypeFrequencyData.indexOf(
              newTypeFrequencyData.find((data) => data.name === type)
            );
            newTypeFrequencyData[index].count++;
          }
        });

        // Word count frequency data transform
        const numOfWords = entity.matchedText.split(' ').length;
        if (
          !newWordCountFrequencyData.some(
            (data) => data.name === `${numOfWords} words`
          )
        ) {
          newWordCountFrequencyData.push({
            name: `${numOfWords} words`,
            count: 1,
          });
        } else {
          const index = newWordCountFrequencyData.indexOf(
            newWordCountFrequencyData.find(
              (data) => data.name === `${numOfWords} words`
            )
          );
          newWordCountFrequencyData[index].count++;
        }

        // Num of types data transform
        const numOfTypes = entity.types.length;
        if (
          !newNumOfTypesData.some((data) => data.name === `${numOfTypes} types`)
        ) {
          newNumOfTypesData.push({ name: `${numOfTypes} types`, count: 1 });
        } else {
          const index = newNumOfTypesData.indexOf(
            newNumOfTypesData.find(
              (data) => data.name === `${numOfTypes} types`
            )
          );
          newNumOfTypesData[index].count++;
        }
      });
    });

    setNumOfTypesData(newNumOfTypesData);
    setWordCountFrequency(newWordCountFrequencyData);
    setTypeFrequencyData(newTypeFrequencyData);

    setFileLinesData(newFileLinesData);
    setLoading(false);
  };

  return (
    <div className={styles.main}>
      <FileUpload
        buttonText="Analyze"
        onConfirm={fileConfirmHandler}
        onClear={clearData}
        onDrop={processFile}
      />
      {loading && <Spinner className={styles.spinner} animation="border" variant="primary" />}
      <div className={styles['chart-wrapper']}>
        <AppPieChart
          className={styles.chart}
          data={typeFrequencyData}
          dataKey="count"
          chartSize={300}
          title="Type frequency"
        />
        <AppPieChart
          className={styles.chart}
          data={numOfTypesData}
          dataKey="count"
          chartSize={300}
          title="Number of types frequency"
        />
        <AppBarChart
          className={styles.chart}
          data={wordCountFrequency}
          dataKeyY="count"
          dataKeyX="name"
          chartSize={300}
          title="Word count frequency"
        />
      </div>
      {fileLinesData.length > 0 && (
        <ListGroup className={styles['list-group']}>
          {fileLinesData.map((line, index) => (
            <ListGroup.Item key={index}>
              <Highlight
                className={styles.line}
                text={line.text}
                matches={
                  line.entities.length > 0
                    ? line.entities.map((entity) => entity)
                    : []
                }
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default App;
