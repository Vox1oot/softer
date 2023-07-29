import React, { useCallback, useReducer, useRef } from 'react';
import { State, Action, ActionType } from './uploader.interface';
import axios from 'axios';
import styles from './Uploader.module.css';

const TOKEN = import.meta.env.VITE_YANDEX_TOKEN;
const YANDEX_UPLOAD_URL = 'https://cloud-api.yandex.net/v1/disk/resources/upload';

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.SET_SELECTED_FILE:
            return { ...state, files: action.payload };
        case ActionType.SET_COUNT:
            return { ...state, count: action.payload };
        case ActionType.SET_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

const initialState: State = {
    files: [],
    count: 0,
    error: 'Необходимо добавить файлы',
};

const UploadFileToYandexDisk: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);

            dispatch({ type: ActionType.SET_SELECTED_FILE, payload: files });
            dispatch({ type: ActionType.SET_ERROR, payload: '' })
        }
    };

    const handleFileSelect = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleFileUpload = useCallback(() => {
        if (state.files.length > 0 && state.files.length < 100) {

            for (const file of state.files) {
                const formData = new FormData();
                formData.append('file', file);

                axios
                    .get(YANDEX_UPLOAD_URL,
                        { headers: { Authorization: `OAuth ${TOKEN}`}, params: { path: `${file.name}`, overwrite: true } })
                    .then(({ data: { href } }) => { axios.put(href, formData) })
                    .then(() => dispatch({ type: ActionType.SET_COUNT, payload: state.count += 1 }))
                    .catch(() => dispatch({ type: ActionType.SET_ERROR, payload: 'Произошла ошибка загрузки файлов'}))
            }
        }

        if (state.files.length > 100) {
            dispatch({ type: ActionType.SET_ERROR, payload: 'Можно загружать до 100 файлов'})
        }
    }, [state.files]);

    return (
        <main>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={handleFileSelect}>Выбрать файлы</button>
                <input ref={inputRef} className={styles.hidden} type="file" onChange={handleFileChange} multiple />
                <button className={styles.button} onClick={handleFileUpload} disabled={state.files.length === 0}>Загрузить</button>
            </div>
            {!state.error && <p>{`Выбрано файлов: ${state.files.length}`}</p>}
            {state.count > 0 && <p>{`Загруженно файлов: ${state.count}`}</p>}
            {state.error && <p className={styles.error}>{state.error}</p>}
        </main>
    );
};

export default UploadFileToYandexDisk;
