import ProjectLayout from "@/components/project-layout";
import React from "react";
import { useForm } from 'react-hook-form';

import {
    TextField,
    Button,
    Box,
    Card,
    Typography,
    CardContent
} from '@mui/material';

const HostnameForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardContent>
                <Typography variant="h6" component="div">
          Basic
        </Typography>
                    <TextField
                        label="Hostname"
                        fullWidth
                        margin="normal"
                        {...register('hostname', {
                            required: 'Hostname is required',
                            pattern: {
                                value: /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.?$/i,
                                message: 'Invalid hostname',
                            },
                        })}
                        variant="standard"
                        error={Boolean(errors.hostname)}
                        helperText={errors.hostname && errors.hostname.message}
                    />
                </CardContent>
            </Card>

            <Button type="submit" variant="contained" className="mt-4">
                Submit
            </Button>
        </Box>
    );
};

export default function Environment() {
    return (
        <ProjectLayout title="Environment">
            {HostnameForm()}
        </ProjectLayout>
    )
}