import { Button } from '@mui/material'
import { PlayArrow, Stop } from '@mui/icons-material';
import ProjectLayout from "@/components/project-layout";

export default function Processes() {
    const handleStartClick = () => {
        // Call the start API here
        console.log('Start button clicked');
      };
    
      const handleStopClick = () => {
        // Call the stop API here
        console.log('Stop button clicked');
      };

    return (
        <ProjectLayout title="Processes">
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
        startIcon={<Stop/>}
        onClick={handleStopClick}
      >
        Stop
      </Button>
        </ProjectLayout>
    )
}