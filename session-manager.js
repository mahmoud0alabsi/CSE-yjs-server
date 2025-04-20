const fs = require('fs/promises');
const { getProjectSessionsPath } = require('./ydoc-store');
const { cleanupDoc, getDocEntry, cleanupProjectDocs } = require('./doc-manager');

const projectConns = new Map(); // projectId => Set<ws>
const tempFiles = new Map();    // projectId => Map<branchId, Array<fileMeta>>
const tempBranches = new Map(); // projectId => Array<branchMeta>

function addConnection(projectId, docName, conn) {
    if (!projectConns.has(projectId)) {
        projectConns.set(projectId, new Set());
    }
    projectConns.get(projectId).add(conn);

    const docEntry = getDocEntry(docName);
    if (docEntry) {
        docEntry.conns.add(conn);
    }
}

async function removeConnection(projectId, docName, conn) {
    const projectSet = projectConns.get(projectId);
    if (!projectSet) return;

    projectSet.delete(conn);

    if (projectSet.size === 0) {
        projectConns.delete(projectId);

        await cleanupProjectDocs(projectId);

        tempBranches.delete(projectId);
        tempFiles.delete(projectId);
        console.log(`[CLEANUP] Deleted temporary branches and files for project ${projectId}`);

        try {
            await fs.rm(getProjectSessionsPath(projectId), { recursive: true, force: true });
            console.log(`[CLEANUP] Deleted all sessions for project ${projectId}`);
        } catch (err) {
            console.error(`[ERROR] Could not delete sessions for ${projectId}:`, err);
        }
    } else {
        await cleanupDoc(docName, projectId, conn);
    }
}
module.exports = {
    addConnection,
    removeConnection,
};