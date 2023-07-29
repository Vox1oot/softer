import React, { useState } from 'react';
import axios from 'axios';

const yandexDiskToken = import.meta.env.VITE_YANDEX_TOKEN;
const requesrtPath = 'https://cloud-api.yandex.net/v1/disk/resources/upload';

const UploadFileToYandexDisk: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await axios.get(requesrtPath, { headers: { Authorization: `OAuth ${yandexDiskToken}`,}, params: { path: `${selectedFile.name}`, overwrite: true } });
        const uploadUrl = response.data.href;
        const res = await axios.put(uploadUrl, formData);
    } catch (error) {
        console.error(error)
    }

    /* const uploadUrl = 'https://cloud-api.yandex.net/v1/disk/resources/upload';

    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post(uploadUrl, formData, {
        headers: {
          Authorization: `OAuth ${yandexDiskToken}`,
        },
        params: {
          path: `/path/to/upload/${selectedFile.name}`, // Specify the path and name of the file on Yandex.Disk.
          overwrite: 'true', // Set to 'true' if you want to overwrite the file if it already exists.
        },
      })
      .then((response) => {
        console.log('File uploaded successfully!', response.data);
        // Handle success.
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        // Handle error.
      }); */
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default UploadFileToYandexDisk;
