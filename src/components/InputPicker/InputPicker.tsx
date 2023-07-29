import React, { useRef } from 'react'
import styles from './InputPicker.module.css';

interface IinputPicker {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InputPicker: React.FC<IinputPicker> = ({ onChange }) => {
    const ref = useRef<HTMLInputElement | null>(null);

    const handlePick = () => {
        if (ref.current) {
            ref.current.click();
        }
    }

  return (
    <>
        <button className={styles.btn} onClick={handlePick}>Выбрать файлы</button>
        <input ref={ref} className={styles.hidden} type='file' multiple onChange={onChange}/>
    </>
  )
}

export default React.memo(InputPicker)