// File: /pages/api/projects/[id]/repository/is-updated.ts

import { NextApiRequest, NextApiResponse } from 'next';
import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

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

  const repositoryPath =  path.join(process.cwd(), 'storage', 'repositories', project.name);

  try {
    const git: SimpleGit = simpleGit(repositoryPath);
    await git.fetch();

    const localBranch = await git.revparse(['HEAD']);
    const remoteBranch = await git.revparse(['origin/HEAD']);

    const isUpdated = localBranch === remoteBranch;

    res.status(200).json({ isUpdated });
  } catch (error) {
    console.error('Failed to check if the repository is updated:', error);
    res.status(500).json({ message: 'An error occurred while checking if the repository is updated.' });
  }
}