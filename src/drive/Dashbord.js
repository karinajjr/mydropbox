import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Container from 'react-bootstrap/Container';
import { useFolder } from "../components/hooks/useFolder";
import AddFileButton from './AddFileButton'
import AddFolderButton from './AddFolderButton'
import Folder from './Folder'
import File from './File'
import FolderBreadcrumbs from './FolderBreadcrumb';
import { useLocation, useParams } from 'react-router-dom'


export default function Dashbord() {
  const statee = useFolder()
  const { folderId } = useParams()
  const { state = {} } = useLocation()
  const { folder, childFolders, childFiles } = useFolder(folderId, state.folder)
  // console.log(childFolders, childFiles, folder)
  useEffect(() => {
  

  }, [folderId])
  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="d-flex algin-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>

        {childFolders?.length > 0 && childFiles?.length > 0 && <hr />}

        {childFolders?.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders?.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "200px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}

        {childFiles?.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "200px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container >
    </>
  )
}


