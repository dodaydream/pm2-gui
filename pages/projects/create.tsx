import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Link
} from '@mui/material';

type FormValues = {
    projectName: string;
    hostname: string;
    gitRepo: string;
};

const apiSaveProject = (data: FormValues) => {
    return fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: data.projectName,
            hostname: data.hostname,
            gitRepoUrl: data.gitRepo,
        }),
      })


}

const steps = ['Project & Hostname', 'Git Repository'];



const MultiStepForm: React.FC = () => {
    const [step, setStep] = useState(0);

    const [savedProject, setSavedProject ] = useState({
        id: 0,
        sshPublicKey: ''
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (step === steps.length - 1) {
            const response = await apiSaveProject(data).then((response) => response.json())
            .then((data) => {
                setSavedProject(data.project);
            });
        }

        setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <>
            <Stepper activeStep={step} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {step === 0 && (
                    <>
                        <TextField
                            label="Project Name"
                            fullWidth
                            margin="normal"
                            {...register('projectName', { required: 'Project name is required' })}
                            error={Boolean(errors.projectName)}
                            helperText={errors.projectName?.message}
                        />
                        <TextField
                            label="Hostname"
                            fullWidth
                            margin="normal"
                            {...register('hostname', {
                                required: 'Hostname is required',
                                pattern: {
                                    value: /^([A-Za-z0-9-]+\.)*[A-Za-z0-9-]+$/i,
                                    message: 'Invalid hostname',
                                },
                            })}
                            error={Boolean(errors.hostname)}
                            helperText={errors.hostname?.message}
                        />
                    </>
                )}
                {step === 1 && (
                    <TextField
                        label="Git Repository"
                        fullWidth
                        margin="normal"
                        {...register('gitRepo', { required: 'Git repository is required' })}
                        error={Boolean(errors.gitRepo)}
                        helperText={errors.gitRepo?.message}
                    />
                )}

                {step === 2 && (
                    <Box>
                    <Typography variant="h5" component="div" gutterBottom>
                      Project Created Successfully
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Please add the following SSH public key to your GitHub repository:
                    </Typography>
                    <Typography variant="body1" component="pre" className="bg-neutral-700 p-2 rounded my-3 font-mono text-sm">
                        {savedProject.sshPublicKey}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      To add the SSH key, follow the instructions in the{' '}
                      <Link href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys#set-up-deploy-keys"
                      target="_blank" rel="noopener noreferrer">
                        GitHub documentation
                      </Link>.
                    </Typography>
                  </Box>
                )}

                <Box>
                    {step > 0 && step !== 2 && (
                        <Button onClick={prevStep} variant="outlined" style={{ marginRight: '1rem' }}>
                            Previous
                        </Button>
                    )}
                    <Button type="submit" variant="contained">
                        {step === steps.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default function CreateProject() {
    return (
        <div className="m-12 mx-auto max-w-5xl">
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div">Create a new project</Typography>
                    <MultiStepForm />
                </CardContent>
            </Card>
        </div>
    )

}
