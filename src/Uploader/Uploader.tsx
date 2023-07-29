import React, { useCallback, useState } from 'react';
import axios from 'axios';

const yandexDiskToken = import.meta.env.VITE_YANDEX_TOKEN;
const requesrtPath = 'https://cloud-api.yandex.net/v1/disk/resources/upload';



const UploadFileToYandexDisk: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(Array.from(event.target.files));
    }
  };

  const handleFileUpload = useCallback(() => {
    if (selectedFile.length > 0 && selectedFile.length < 100) {
        for (const file of selectedFile) {
            const formData = new FormData();
            formData.append('file', file);

            axios
                .get(requesrtPath,
                    { headers: { Authorization: `OAuth ${yandexDiskToken}`}, params: { path: `${file.name}`, overwrite: true } })
                .then(({ data: { href } }) => {
                    axios.put(href, formData) })
                .then(() => setCount((prev) => prev += 1))
        }
    }

    if (selectedFile.length === 0) {
        setError('Добавьте файлы');
    }

    if (selectedFile.length > 100) {
        setError('Можно загружать до 100 файлов')
    }
  }, [selectedFile]);

  return (
    <main>
        <div>
            <input type="file" onChange={handleFileChange} multiple />
            <button onClick={handleFileUpload}>Upload</button>
        </div>
        {count > 0 && <p>{`Загруженно файлов: ${count}`}</p>}
        {error && <p>{error}</p>}
    </main>
  );
};

export default UploadFileToYandexDisk;
