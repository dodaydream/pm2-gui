import { PlayArrow, Stop } from '@mui/icons-material';
import ProjectLayout from "@/components/project-layout";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface ProcessStatus {
  name: string;
  pid: number;
  pm_id: number;
  pm2_env: {
    status: string;
  },
  monit: {
    memory: number;
    cpu: number;
  };
}

export default function Processes() {
  const router = useRouter();

  const { id } = router.query;
  const [processStatuses, setProcessStatuses] = useState<ProcessStatus[]>([]);
  const fetchData = async () => {
    const response = await fetch(`/api/projects/${id}/processes/status`).then((res) => res.json());

    setProcessStatuses(response.processList);
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Fetch data every 5 seconds (5000 milliseconds)

    return () => {
      clearInterval(intervalId); // Clean up the interval when the component is unmounted
    };
  }, [id]);

  const handleStartClick = async () => {
    const response = await fetch(`/api/projects/${id}/processes/start`).then((res) => res.json());
    alert(response.message)
    fetchData();
  };

  const handleStopClick = async () => {
    const response = await fetch(`/api/projects/${id}/processes/stop`).then((res) => res.json());
    alert(response.message)
    fetchData();
  };

  return (
    <ProjectLayout title="Processes">
      <div className="flex items-center gap-3">
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrow />}
        onClick={handleStartClick}
      >
        Start
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<Stop />}
        onClick={handleStopClick}
      >
        Stop
      </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>PID</TableCell>
            <TableCell>PM ID</TableCell>
            <TableCell>Memory</TableCell>
            <TableCell>CPU</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processStatuses.map((status, index) => (
            <TableRow key={index}>
              <TableCell>{status.name}</TableCell>
              <TableCell>{status.pm2_env.status}</TableCell>
              <TableCell>{status.pid}</TableCell>
              <TableCell>{status.pm_id}</TableCell>
              <TableCell>{status.monit.memory}</TableCell>
              <TableCell>{status.monit.cpu}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ProjectLayout>
  )
}