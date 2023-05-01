import ProjectLayout from "@/components/project-layout"
import { Table, Button, Card, Typography, CardContent, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import { Add, AddOutlined } from "@mui/icons-material"
import { CreateDatabaseModal } from './create-modal'
import { useRef } from "react"

export default function Database() {
    const modalRef = useRef(null);

    const openModal = () => {
        console.log(modalRef)
        modalRef.current?.openModal();
        console.log('trigger modal open')
    }

    return (
        <ProjectLayout title="Database">
            Host: localhost, Port: 3306

            <CreateDatabaseModal ref={modalRef}/>

            <Card className="my-3">
                <CardContent>
                <div className="flex items-center">
                    <h2 className="font-bold text-lg flex-1 m-0">Database</h2>
                    <div>
                        <Button startIcon={<AddOutlined />} onClick={openModal}>
                            Create
                        </Button>
                    </div>
                </div>
                </CardContent>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Database Name</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow>
                        <TableCell>diyi</TableCell>
                        <TableCell>
                            <Button>Delete</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </Card>

            <Card className="mb-3">
                <CardContent>
                <div className="flex items-center">
                    <h2 className="font-bold text-lg flex-1 m-0">Database Users</h2>
                    <div>
                        <Button startIcon={<AddOutlined />}>
                            Create
                        </Button>
                    </div>
                </div>
                </CardContent>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Database Users</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    <TableRow>
                        <TableCell>diyi</TableCell>
                        <TableCell>
                            <Button>Delete</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            </Card>
        </ProjectLayout>
    )
}