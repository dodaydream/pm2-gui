import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link'

interface Project {
  id: number;
  name: string;
  hostname: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data: Project[] = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <CircularProgress />
      </main>
    );
  }

  return (
    <div className="p-24">
      <h1 className="text-3xl font-bold">All Projects</h1>
      <main className="grid grid-cols-3 gap-4 items-center justify-between">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent>
              <Link href={`/projects/${project.id}`}  style={{ textDecoration: 'none', color: 'unset' }}>
                <Typography variant="h5" component="div">
                  {project.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {project.hostname}
                </Typography>
              </Link>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
