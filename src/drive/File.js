import React from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function File({ file }) {
  return (
    <a
      href={file?.url}
      target="_blank"
      className="btn btn-outline-drak text-truncate w-100"
    >
      <AttachFileIcon className='mr-2' />
      {file?.name}
    </a>
  )
}
