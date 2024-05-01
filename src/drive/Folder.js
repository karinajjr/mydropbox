import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import FolderIcon from '@mui/icons-material/Folder';


export default function Folder({ folder }) {
  return (
    <div>
      <Button
        to={{
          pathname: `/folder/${folder.id}`,
          state: { folder: folder },
        }}
        variant="outline-dark"
        className="text-truncate w-100"
        as={Link}
      >
        <FolderIcon className='mr-2' />
        {folder.name}
      </Button>
    </div>
  )
}
