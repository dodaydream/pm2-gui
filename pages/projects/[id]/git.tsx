import ProjectLayout from "@/components/project-layout"
import { Card, Alert, CircularProgress } from "@mui/material"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, List, ListItem, ListItemIcon, ListItemText, Typography, Breadcrumbs, Link, CardContent, Grid } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface FileOrFolder {
  name: string;
  type: 'file' | 'folder';
  commitHash: string;
  lastModified: string;
  author: string;
  message: string;
}

const Repository = () => {
  const router = useRouter();
  const { id } = router.query;
  const [filesAndFolders, setFilesAndFolders] = useState<FileOrFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cwd, setCwd] = useState('/')
  const [cwdLatestCommit, setCwdLatestCommit] = useState<any>(null)

  const handleNavigationClick = (newCwd: string) => {
    console.log("newCWD: ", newCwd)
    setCwd(newCwd);
  };

  const renderBreadcrumbs = () => {
    const parts = cwd.split('/').filter((part) => part.length > 0);

    const breadcrumbs = [
      {
        label: 'root',
        path: '/',
      },
      ...parts.map((part, index) => ({
        label: part,
        path: '/' + parts.slice(0, index + 1).join('/'),
      })),
    ];

    return (
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <Link
            key={breadcrumb.path}
            color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
            onClick={() => handleNavigationClick(breadcrumb.path)}
          >
            {breadcrumb.label}
          </Link>
        ))}
      </Breadcrumbs>
    );
  };

  const fetchFilesAndFolders = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/projects/${id}/repository/files${cwd !== '/' ? `?directory=${cwd}` : ''}`);
      const data = await response.json();

      const files: FileOrFolder[] = data.files
      setFilesAndFolders(files);
      setCwdLatestCommit(data.cwdLatestCommit)
    } catch (error) {
      console.error('Failed to fetch files and folders:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const checkIsUpToDate = async () => {
    // TODO: tobe implemented
    console.log("check if is up to date, by using the is-updated endpoint")
  }

  useEffect(() => {
    if (!id) return;
    fetchFilesAndFolders();
    checkIsUpToDate();
  }, [id]);

  useEffect(() => {
    fetchFilesAndFolders();
  }, [cwd])

  const navigateToDirectory = async (directory: string) => {
    if (directory) {
      setCwd(cwd !== '/' ? (cwd + '/' + directory) : `/${directory}`)
    }
  }

  const onFileItemClick = (type: string, directory: string) => {
    switch (type) {
      case 'folder':
        navigateToDirectory(directory)
        return;
      case 'file':
        alert("viewing files are currently not implemented")
    }
  }

  const renderFileOrFolderIcon = (type: 'file' | 'folder') => {
    if (type === 'file') {
      return <InsertDriveFileIcon />;
    }

    return <FolderIcon />;
  };

  return (
    <Card>
      <CardContent>
        {renderBreadcrumbs()}

        {cwdLatestCommit &&
          <div className="flex gap-3 w-full mt-3">
              <ListItemText primary={cwdLatestCommit.author} />
              <ListItemText
                secondary={cwdLatestCommit.message}
                className="flex-1 w-full"
              />
              <ListItemText
                secondary={cwdLatestCommit.lastModified ? formatDistanceToNow(new Date(cwdLatestCommit.lastModified), {
                  addSuffix: true
                }) : ''}
              />
          </div>}
      </CardContent>
      <List>
        {!isLoading && filesAndFolders && filesAndFolders.map((item) => (
          <ListItem key={item.name} onClick={() => onFileItemClick(item.type, item.name)}>
            {/* <ListItemIcon>{renderFileOrFolderIcon(item.type)}</ListItemIcon>
            <ListItemText primary={item.name} />
            <ListItemText secondary={item.message} />
            <ListItemText secondary={item.lastModified} /> */}
            <Grid container>
              <Grid item xs={6}>
                <div className="flex items-center">
                  <ListItemIcon>{renderFileOrFolderIcon(item.type)}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </div>
              </Grid>
              <Grid item xs={3}>
                <ListItemText
                  primary={item.message}
                  primaryTypographyProps={{ align: 'right' }}
                />
              </Grid>
              <Grid item xs={3}>
                <ListItemText
                  primary={item.lastModified ? formatDistanceToNow(new Date(item.lastModified), {
                    addSuffix: true
                  }) : ''}
                  primaryTypographyProps={{ align: 'right' }}
                />
              </Grid>
            </Grid>
          </ListItem>
        ))}

        {isLoading && (
          <ListItem key="loading">
            <CircularProgress />
          </ListItem>
        )}
      </List>
    </Card>
  );
}


export default function Git() {
  return (
    <ProjectLayout title="Git">
      <Alert severity="success">Up to date!</Alert>

      <Repository />
    </ProjectLayout>
  )
}