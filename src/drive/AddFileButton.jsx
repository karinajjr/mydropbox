// import React, { useState } from 'react';

// const hostUrl = 'http://localhost:3000/upload'; // Поменяйте на нужный URL для загрузки файла

// export const AddFileButton = () => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [uploaded, setUploaded] = useState(null);

//     const handleChange = (event) => {
//         console.log(event.target.files);
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!selectedFile) {
//             alert('Please select a file');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', selectedFile);

//         try {
//             const res = await fetch(hostUrl, {
//                 method: 'POST',
//                 body: formData,
//             });
//             const data = await res.json();
//             setUploaded(data);
//         } catch (error) {
//             console.error('Error uploading file:', error);
//         }
//     };

//     return (
//         <>
//             <input
//                 type="file"
//                 onChange={handleChange}
//             />

//             <button onClick={handleUpload}>Upload now!</button>

//             {uploaded && (
//                 <div>
//                     <h2>{uploaded.fileName}</h2>
//                     <img alt='' src={uploaded.filePath} width="200" />
//                 </div>
//             )}
//         </>
//     );
// };

// export default AddFileButton;

import React, { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useAuth } from "../components/contexts/AuthContext";
import { storage, database } from "../firebase";
import { ROOT_FOLDER } from "../components/hooks/useFolder";
import ReactDOM from "react-dom";
import { v4 as uuidV4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();

  function handleUpload(e) {
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;

    const id = uuidV4();
    setUploadingFiles((prevUploadingFiles) => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: null },
    ]);

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;

    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }
            return uploadFile;
          });
        });
      },

      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true };
            }
            return uploadFile;
          });
        });
      },
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== id;
          });
        });

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.files
            .where("name", "==", file.name)
            .where("userId", "==", currentUser.uid)
            .where("folderId", "==", currentFolder.id)
            .get()
            .then((existingFiles) => {
              const existingFile = existingFiles.docs[0];
              if (existingFile) {
                existingFile.ref.update({ url: url });
              } else {
                database.files.add({
                  url: url,
                  name: file.name,
                  createdAt: database.getCurrentTimestamp(),
                  folderId: currentFolder.id,
                  userId: currentUser.uid,
                });
              }
            });
        });
      }
    );
  }

  return (
    <>
      <label className=" btn btn-outline-success btn-sm m-0 mr-2 ">
        <FileUploadIcon />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles((prevUploadingFiles) => {
                    return prevUploadingFiles.filter((uploadFile) => {
                      return uploadFile.id !== file.id;
                    });
                  });
                }}
              >
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
