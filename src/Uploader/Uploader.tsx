import React, { useCallback, useState } from 'react';
import axios from 'axios';

const yandexDiskToken = import.meta.env.VITE_YANDEX_TOKEN;
const requesrtPath = 'https://cloud-api.yandex.net/v1/disk/resources/upload';



const UploadFileToYandexDisk: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(Array.from(event.target.files));
    }
  };

  const handleFileUpload = useCallback( async () => {
    if (selectedFile.length > 0) {
        for (const file of selectedFile) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.get(requesrtPath, { headers: { Authorization: `OAuth ${yandexDiskToken}`,}, params: { path: `${file.name}`, overwrite: true } });
            const uploadUrl = response.data.href;

            await axios.put(uploadUrl, formData);
        }
    }
  }, [selectedFile]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default UploadFileToYandexDisk;
