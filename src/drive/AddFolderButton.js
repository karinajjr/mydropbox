import React, { useState} from 'react';
import {Button, Modal, Form} from 'react-bootstrap'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import {database} from '../firebase'
import {useAuth} from '../components/contexts/AuthContext';
import { ROOT_FOLDER } from '../components/hooks/useFolder';

export default function AddFolderButton({currentFolder}) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const { currentUser } = useAuth()
    console.log(currentFolder)
    function openModal() {
        setOpen(true)
    }

    function closeModal() {
        setOpen(false)
    } 

    function handleSubmit(e) { 
        e.preventDefault()
        if (currentFolder == null) return 

        const path = [...currentFolder.path]    
        if (currentFolder !== ROOT_FOLDER){
            path.push({name: currentFolder.name, id: currentFolder.id })
        }  
        
        database.folders.add({
            name: name,
            parentId: currentFolder.id,
            userId: currentUser.uid,
            path: path,
            createdAt: database.getCurrentTimestamp(),
        })

        setName("")
        closeModal()
    }

  return (
   <>
    <Button onClick={openModal} variant="outline-success" size="sm">
        <CreateNewFolderIcon/>
    </Button>
    <Modal show={open} onHide={closeModal}>
     <Form onSubmit={handleSubmit}>
        <Modal.Body>
            <Form.Group>
                <Form.Label> Folder Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
                close
            </Button>
            <Button variant="succes" type="submit">
                Add folder
            </Button>
        </Modal.Footer>
      </Form>
    </Modal>
    </>
  )
}
