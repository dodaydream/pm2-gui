// File: /pages/api/projects/[id]/start-process.ts

import { NextApiRequest, NextApiResponse } from 'next';
const PM2 = require('pm2').custom;
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const appRoot = process.cwd();

const revertToOriginalCwd = () => {
  process.chdir(appRoot);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, env } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Project ID is required.' });
  }

  const project = await prisma.project.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }


  const repoFolderPath = path.join(process.cwd(), 'storage', 'repositories', project.name);

  process.chdir(repoFolderPath)

  const pm2 = new PM2({
    cwd: repoFolderPath,
  })

  // Connect to the PM2 daemon
  pm2.connect((connectErr) => {
    if (connectErr) {
      console.error('Error connecting to PM2 daemon:', connectErr);
      res.status(500).json({ message: 'Error connecting to PM2 daemon.' });

      revertToOriginalCwd();
      return;
    }

    // Start the processes using the ecosystem.config.js file
    pm2.start(`${repoFolderPath}/ecosystem.config.js`, {
      env: env ?? undefined,
      namespace: project.name,
    }, (startErr, apps) => {
      // Disconnect from the PM2 daemon
      pm2.disconnect();
      revertToOriginalCwd();
      
      if (startErr) {
        console.error('Error starting the processes:', startErr);
        res.status(500).json({ message: 'Error starting the processes.' });
        return;
      }

      res.status(200).json({ message: 'Processes started successfully.' });
    });
  });
}
