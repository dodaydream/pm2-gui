// pages/api/save-project.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const prisma = new PrismaClient();

const generateSSHKey = async (name: String) => {
    const { stdout } = await execPromise(`ssh-keygen -t ed25519 -f ./storage/keys/id_${name}_ed25519 -N "" -q -C "git@${name}"`);
    console.log("ssh keys generated", stdout);

    const { stdout: publicKey } = await execPromise(`cat ./storage/keys/id_${name}_ed25519.pub`);

    return publicKey;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, hostname, gitRepoUrl, sshPublicKey } = req.body;

    // check if project already exists
    const existingProject = await prisma.project.findFirst({
        where: {
            name,
        },
    });

    if (existingProject) {
        res.status(400).json({ message: 'Project already exists' });
        return;
    }

    const publicKey = await generateSSHKey(name);

    try {
      const project = await prisma.project.create({
        data: {
          name,
          hostname,
          gitRepoUrl,
          sshPublicKey: publicKey
        },
      });

      res.status(200).json({ message: 'Project saved successfully', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to save project' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
