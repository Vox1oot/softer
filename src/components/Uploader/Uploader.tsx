import React, { useCallback, useReducer, useState } from 'react';
import axios from 'axios';
import InputPicker from '../InputPicker';

const yandexDiskToken = import.meta.env.VITE_YANDEX_TOKEN;
const requesrtPath = 'https://cloud-api.yandex.net/v1/disk/resources/upload';

interface IInitialState {
    files: File[],
    error: string,
    status: string,
}

interface Action {
    type: ACTION_TYPE,
    payload: string | File[],
}

enum ACTION_TYPE {
    ADD_FILES = 'ADD_FILES',
    SET_ERROR = 'SET_ERROR',
    SET_STATUS = 'SET_STATUS',
}

const reducer = (state: IInitialState, action: Action) => {
    switch (action.type) {
        case ACTION_TYPE.ADD_FILES: {
            return {
                ...state,
                files: action.payload,
                error: '',
            }
        }
        case ACTION_TYPE.SET_ERROR: {
            return {
                ...state,
                error: action.payload,
                status: 'error',
            }
        }
        case ACTION_TYPE.SET_STATUS: {
            return {
                ...state,
                status: action.payload
            }
        }
    }
};

const initialState: IInitialState = {
    files: [],
    error: 'Необходимо добавить файлы',
    status: 'idle',
}

const Uploader: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            if (event.target.files.length >= 1 && event.target.files.length < 100) {
                const selectedFiles = Array.from(event.target.files);

                dispatch({ type: ACTION_TYPE.ADD_FILES, payload: selectedFiles });
            } else {
                dispatch({ types: ACTION_TYPE.SET_ERROR, paylod: 'Можно добавить от 1 до 100 файлов' });
            }
        } else {
            dispatch({ type: ACTION_TYPE.SET_ERROR, payload: 'Необходимо добавить файлы' });
        }
    }, []);

    const handleFileUpload = async () => {
        dispatch({ type: ACTION_TYPE.SET_STATUS, payload: 'loading'});

        const formData = new FormData();
        formData.append('file', state.files);

        for (const file of state.files) {
            try {
                const response = await axios
                    .get(requesrtPath, { headers: { Authorization: `OAuth ${yandexDiskToken}`,}, params: { path: `${file.name}`, overwrite: true } });

                    const uploadUrl = response.data.href;
                    const res = await axios.put(uploadUrl, formData);
            } catch (error) {
                dispatch({ type: ACTION_TYPE.SET_ERROR, payload: 'произошла ошибка загрузки'});
            }
        }

  };

    return (
        <>
            <div className='uploader'>
                <InputPicker onChange={handleFileChange}/>
                <button onClick={handleFileUpload}>Upload</button>
            </div>
            {state.error && <p className='error'>{state.error}</p>}
            {state.files.length > 0 && <p>{`Вы добавили файлов: ${state.files.length} `}</p>}
        </>
    );
};

export default Uploader;
