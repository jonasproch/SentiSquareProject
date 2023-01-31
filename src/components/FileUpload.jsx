import { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from './FileUpload.module.css';

const FileUpload = (props) => {
  const [file, setFile] = useState(null);
  const [dragover, setDragover] = useState(false);

  const fileInputRef = useRef();

  const clearInput = () => {
    setFile(null);
    fileInputRef.current.value = '';
    props.onClear();
  };

  const onDropHandler = () => {
    const newFile = fileInputRef.current.files[0];

    if (newFile) {
      setFile(newFile);
      props.onDrop(newFile);
    }
  };

  const onConfirm = () => {
    props.onConfirm(file);
  };

  return (
    <>
      <div className={styles['file-upload']}>
        <div className={styles['file-upload__label']}>
          {!dragover && !file && (
            <>
              <p>Drag & drop your file here or</p>
              <Button>Choose file</Button>
            </>
          )}
          {dragover && <span>Drop your file!</span>}
          {file && !dragover && (
            <span>
              Selected file: <b>{file.name}</b>
            </span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onDragEnter={() => setDragover(true)}
          onDragLeave={() => setDragover(false)}
          onDrop={() => setDragover(false)}
          onChange={onDropHandler}
        />
      </div>
      <div className={styles.buttons}>
        <Button variant="outline-danger" onClick={clearInput}>
          Clear
        </Button>
        <Button className={styles['primary-button']} onClick={onConfirm}>{props.buttonText}</Button>
      </div>
    </>
  );
};

export default FileUpload;
