import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, IconButton, Menu, MenuItem } from "@mui/material"
import { useRouter } from 'next/router';
import Link from "next/link"
import { Dashboard, GitHub, Home, Hub, Storage, Settings, ArrowDropDown, DataObject, Memory } from "@mui/icons-material"
import { useState, Fragment } from "react";

const features = [
    {
        name: 'Dashboard',
        icon: Dashboard,
        path: '',
    },
    {
        name: 'Processes',
        icon: Memory,
        path: 'processes',
    },
    {
        name: 'Git',
        icon: GitHub,
        path: 'git',
    },
    {
        name: 'Database',
        icon: Storage,
        path: 'database',
    },
    {
        name: 'Reverse Proxy',
        icon: Hub,
        path: 'rev-proxy',
    },
    {
        name: 'Environment',
        icon: DataObject,
        path: 'environment',
    }
]

const envs = [
    'production',
    'staging',
]

const currentEnv = 'production'

type ProjectContextProps = {
    id: number
}

const renderEnvSelectionMenu = () => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedEnv, setSelectedEnv] = useState(currentEnv);
    const open = Boolean(anchorEl);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        env: string
    ) => {
        setSelectedEnv(env);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <Fragment>
            <ListItem
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickListItem}
                secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                        <ArrowDropDown />
                    </IconButton>
                }
            >
                <ListItemText
                    primary={capitalize(selectedEnv)}
                    secondary="production.example.com"
                />
            </ListItem>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                }}
            >
                {envs.map((env) => (
                    <MenuItem
                        key={env}
                        selected={env === selectedEnv}
                        onClick={(event) => handleMenuItemClick(event, env)}
                    >
                        {env}
                    </MenuItem>
                ))}

            </Menu>
        </Fragment>
    )
}

const renderMenuItems = ({ id }: ProjectContextProps) => {
    const isSelected = (path: string) => {
        const router = useRouter();

        // check if the path contains the current path

        console.log('router match', router.pathname)

        return router.pathname === `/projects/[id]${path ? `/${path}` : ''}`;
    }

    return (
        features.map(feature => {
            return (
                <ListItem disablePadding>
                    <ListItemButton
                        selected={isSelected(feature.path)}
                        href={`/projects/${id}/${feature.path}`} component={Link}>
                        <ListItemIcon>
                            <feature.icon />
                        </ListItemIcon>
                        <ListItemText>{feature.name}</ListItemText>
                    </ListItemButton>
                </ListItem>
            )
        })
    )
}

const renderSideMenu = ({ id }: ProjectContextProps) => {

    return (
        <List>
            <ListItem>
                <div className="font-bold text-lg">Project Name</div>
            </ListItem>

            {renderEnvSelectionMenu()}
            {renderMenuItems({ id: id })}


        </List>
    )
}

export default function ProjectLayout({ children, title }: any) {
    const router = useRouter();

    return (
        <main className="flex min-h-screen">
            <nav className="w-72 flex-col">
                {renderSideMenu({ id: parseInt(router.query.id as string) })}
            </nav>
            <main className="w-full flex-1 p-4">
                {title && <h1 className="text-3xl font-bold">{title}</h1>}
                {children}
            </main>
        </main>
    )
}