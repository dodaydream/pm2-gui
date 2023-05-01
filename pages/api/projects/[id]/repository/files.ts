import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import simpleGit, { SimpleGit } from 'simple-git';

const prisma = new PrismaClient();

const getFilesInDirectory = (directoryPath: string) => {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

    const files = entries
        .filter((entry) => !entry.isDirectory())
        .map((entry) => ({ name: entry.name, type: 'file' }));

    const folders = entries
        .filter((entry) => entry.isDirectory() && entry.name !== '.git')
        .map((entry) => ({ name: entry.name, type: 'folder' }));

    return [...folders, ...files];
};

interface FileOrFolder {
    name: string;
    type: 'file' | 'folder';
    commitHash: string;
    lastModified: string;
    author: string;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, directory } = req.query;

    const project = await prisma.project.findUnique({
        where: {
            id: Number(id),
        },
    });

    const repoFolderPath = path.join(process.cwd(), 'storage', 'repositories', project.name);

    try {
        const git: SimpleGit = simpleGit(repoFolderPath);

        const cwd = directory ? path.join(repoFolderPath, String(directory)) : repoFolderPath

        const files = getFilesInDirectory(cwd);

        const filesAndFolders = await Promise.all(files.map(async f => {
            const log = await git.log({ file: path.join(cwd, f.name), maxCount: 1 });

            console.log('file: ', f.name, log.latest)
            const latestCommit = log.latest;

            return {
                ...f,
                commitHash: latestCommit?.hash ?? '',
                lastModified: latestCommit?.date ?? '',
                author: latestCommit?.author_name ?? '',
                message: latestCommit?.message ?? ''
            }
        }));

        const cwdLatestLog = await git.log({ file: cwd, maxCount: 1 });
        const cwdLatestCommit = cwdLatestLog.latest

        res.status(200).json({
            files: filesAndFolders,
            cwdLatestCommit: {
                commitHash: cwdLatestCommit?.hash ?? '',
                lastModified: cwdLatestCommit?.date ?? '',
                author: cwdLatestCommit?.author_name ?? '',
                message: cwdLatestCommit?.message ?? ''
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch files and folders' });
    }
}