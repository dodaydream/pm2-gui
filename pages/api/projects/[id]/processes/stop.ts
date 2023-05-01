// File: /pages/api/projects/[id]/start-process.ts

import { NextApiRequest, NextApiResponse } from 'next';
import pm2 from 'pm2';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

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

  // Connect to the PM2 daemon
  pm2.connect((connectErr) => {
    if (connectErr) {
      console.error('Error connecting to PM2 daemon:', connectErr);
      res.status(500).json({ message: 'Error connecting to PM2 daemon.' });
      return;
    }

    // Stop the processes using the ecosystem.config.js file
    pm2.stop(`${repoFolderPath}/ecosystem.config.js`, (startErr, apps) => {
      // Disconnect from the PM2 daemon
      pm2.disconnect();

      if (startErr) {
        console.error('Error stopping the processes:', startErr);
        res.status(500).json({ message: 'Error stopping the processes.' });
        return;
      }

      res.status(200).json({ message: 'Processes stopped successfully.' });
    });
  });
}
