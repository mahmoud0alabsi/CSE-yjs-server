const { setupWSConnection } = require('y-websocket/bin/utils');
const { getRoomInfo } = require('./utils');
const { loadDoc, cleanupDoc } = require('./doc-manager');
const {
    addConnection,
    removeConnection,
} = require('./session-manager');

async function handleConnection(conn, req) {
    const params = new URLSearchParams(req.url.replace(/^.*\?/, ''));
    const docName = params.get('doc');

    if (!docName) {
        console.log('[Yjs Server] Doc name: ' + docName);
        console.log('[Yjs Server] Closing connection: Missing doc');
        conn.close(1008, 'Missing doc');
        return;
    }

    const { projectId, branchId, fileId } = getRoomInfo(docName);

    if (!projectId || !branchId || !fileId) {
        console.log('[Yjs Server] Doc name: ' + docName);
        console.log('[Yjs Server] Closing connection: Invalid doc name format');
        conn.close(1008, 'Invalid doc name format');
        return;
    }

    // Load or create document
    const docEntry = await loadDoc(docName, projectId, branchId, fileId);
    if (!docEntry) {
        console.log('[Yjs Server] Closing connection: Failed to load document');
        conn.close(1008, 'Failed to load document');
        return;
    }

    // Track connection
    addConnection(projectId, docName, conn);

    // Setup WebSocket sync
    setupWSConnection(conn, req, {
        doc: docEntry.ydoc,
        gc: true
    });


    // Log connection closure
    conn.on('close', async (code, reason) => {
        console.log(`[Yjs Server] Connection closed for ${docName}:`, { code, reason: reason.toString() });
        await removeConnection(projectId, docName, conn);
    });

    // Log connection errors
    conn.on('error', (error) => {
        console.error(`[Yjs Server] Connection error for ${docName}:`, error);
    });
}

module.exports = { handleConnection };
