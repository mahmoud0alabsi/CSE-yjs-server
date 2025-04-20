const fs = require('fs/promises');
const path = require('path');
const Y = require('yjs');

const SESSION_DIR = path.join(__dirname, 'sessions');

function getFilePath(projectId, branchId, fileId) {
    return path.join(SESSION_DIR, projectId, branchId, `${fileId}.ydoc`);
}

function getProjectSessionsPath(projectId) {
    return path.join(SESSION_DIR, projectId);
}

async function loadYDoc(projectId, branchId, fileId) {
    const doc = new Y.Doc();
    const filePath = getFilePath(projectId, branchId, fileId);

    try {
        const data = await fs.readFile(filePath);
        Y.applyUpdate(doc, new Uint8Array(data));
        console.log(`[LOAD] Restored doc from ${filePath}`);
    } catch {
        console.log(`[INIT] No previous file, created new for ${filePath}`);
    }

    return doc;
}

async function saveYDoc(projectId, branchId, fileId, doc) {
    const filePath = getFilePath(projectId, branchId, fileId);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const update = Y.encodeStateAsUpdate(doc);
    await fs.writeFile(filePath, update);
    console.log(`[SAVE] Saved doc to ${filePath}`);
}

module.exports = {
    loadYDoc,
    saveYDoc,
    getProjectSessionsPath
};
