const Y = require('yjs');
const { loadYDoc, saveYDoc } = require('./ydoc-store');

const docs = new Map(); // docName => { ydoc, conns, projectId, branchId, fileId }

async function loadDoc(docName, projectId, branchId, fileId) {
  if (!docs.has(docName)) {
    console.log(`[Yjs] Doc not exist, Loading doc ${docName}...`);
    const ydoc = await loadYDoc(projectId, branchId, fileId);

    // Attach metadata map (if missing)
    const meta = ydoc.getMap('meta');
    if (!meta.has('initialized')) {
      meta.set('initialized', false);
    }

    ydoc.on('update', () => {
      const preview = ydoc.getText('monaco').toString().substring(0, 50);
      console.log(`[Yjs] Doc ${docName} updated: "${preview}..."`);
    });

    docs.set(docName, {
      ydoc,
      conns: new Set(),
      projectId,
      branchId,
      fileId
    });

    console.log(`[Yjs] Created or loaded doc ${docName}`);
  }
  return docs.get(docName);
}

async function cleanupDoc(docName, projectId, conn) {
  const docEntry = docs.get(docName);
  if (!docEntry) return;

  docEntry.conns.delete(conn);
  if (docEntry.conns.size === 0) {
    try {
      await saveYDoc(projectId, docEntry.branchId, docEntry.fileId, docEntry.ydoc);
      docEntry.ydoc?.destroy();
      docEntry.conns.clear();
      docEntry.ydoc = null;
      docEntry.conns = null;
      docs.delete(docName);
      console.log(`[SAVE] Saved and unloaded doc ${docName}`);
    } catch (err) {
      console.error(`[ERROR] Could not save doc ${docName}:`, err);
    }
  }
}

function getDocEntry(docName) {
  return docs.get(docName);
}

async function cleanupProjectDocs(projectId) {
  for (const [key, value] of docs) {
    if (key.startsWith(`${projectId}/`)) {
      console.log(`[CLEANUP] Checking doc ${key}...`);
      value.ydoc?.destroy();
      value.conns.clear();
      value.ydoc = null;
      value.conns = null;
      docs.delete(key);
      console.log(`[CLEANUP] Deleted doc ${key} as no connections left`);
    }
  }
}

module.exports = { loadDoc, cleanupDoc, getDocEntry, cleanupProjectDocs };