# CodeSpace Editor - Yjs Server

###

<div align="center">
<img width="300px" src="https://github.com/mahmoud0alabsi/mahmoud0alabsi/blob/main/assets/logo/codespace.png?raw=true"/>
</div>

###

The CodeSpace Editor Yjs Server enables real-time collaborative editing for the [CodeSpace Editor](https://github.com/mahmoud0alabsi/CSE-React) platform. It uses Yjs, a Conflict-free Replicated Data Type (CRDT) library, to synchronize document changes across multiple users in real time, integrated with the React.js frontend and Spring Boot backend.

###

🎥 [Watch the CodeSpace Editor Tour](https://youtu.be/xTDq5a8hy6A)

###

## Functionality

- **Real-Time Collaboration**: Synchronizes code edits across users in the `/collaborative-editor` route, ensuring seamless collaboration.
- **Conflict-Free Editing**: Uses CRDT to resolve edit conflicts automatically, maintaining document consistency without manual merging.
- **WebSocket Communication**: Facilitates low-latency updates via WebSocket, connecting the frontend's Monaco Editor to the Yjs server.
- **Document Persistence**: Stores document state in memory (or optionally a database) for session continuity.
- **Scalability**: Supports multiple concurrent editing sessions for different projects and files.

## Why Yjs for CodeSpace Editor?

Yjs is chosen for its robust CRDT implementation, which is ideal for collaborative code editing:

- **Conflict-Free Replicated Data Types (CRDT)**: Yjs uses CRDT to ensure that concurrent edits by multiple users are merged without conflicts. Each edit is assigned a unique identifier, allowing the system to reconstruct a consistent document state regardless of the order or timing of updates.
- **Efficient Synchronization**: Yjs minimizes data transfer by sending only incremental updates, reducing bandwidth usage and latency.
- **Monaco Editor Integration**: Yjs integrates seamlessly with Monaco Editor, enabling real-time cursor tracking, text edits, and selection sharing in the CodeSpace Editor frontend.
- **Flexibility**: Supports in-memory or persistent storage, making it adaptable to CodeSpace Editor's needs.
- **Offline Support**: CRDT allows users to edit offline and sync changes when reconnected, enhancing reliability.

In CodeSpace Editor, Yjs powers the `/collaborative-editor` route, complementing the Spring Boot backend's project and commit management by handling live document collaboration.

## Tech Stack

- **Server**: Node.js, Yjs, `y-websocket`
- **Protocol**: WebSocket
- **Package Manager**: npm

## Prerequisites

- Node.js 18+
- npm 9+
- [CodeSpace Editor Frontend](https://github.com/mahmoud0alabsi/CSE-React) and [Backend](https://github.com/mahmoud0alabsi/CSE-SpringBoot) running

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mahmoud0alabsi/CSE-yjs-server.git
cd CSE-yjs-server
```

### 2. Install Dependencies

```bash
npm install
```

Install `y-websocket` if not already included:

```bash
npm install y-websocket
```

### 3. Configure the Server

The `server.js` file is preconfigured to run the Yjs WebSocket server. Optionally, update the port or persistence settings in `server.js`:

```javascript
server.listen(1234, () => {
  console.log('✅ Yjs server running at ws://localhost:1234');
});
```

### 4. Run the Server

Start the Yjs WebSocket server:

```bash
node server.js
```

- The server runs on `ws://localhost:1234` by default.
- Ensure the frontend's `.env` file (`YJS_WS_URL=ws://localhost:1234`) matches this address.

### 5. Verify Integration

- Open the CodeSpace Editor frontend (`http://localhost:3000/collaborative-editor`).
- Multiple users should be able to edit the same file in real time, with changes synced instantly via Monaco Editor.

## Usage

- **Collaborative Editing**: Users access `/collaborative-editor` in the frontend to edit files. Yjs synchronizes changes across all connected clients.
- **Backend Integration**: The Spring Boot backend handles project, branch, and commit management, while the Yjs server manages live document state.
- **Session Management**: Each file in a project has a unique Yjs document, identified by a document name (e.g., `projectId/branchId/fileId`).

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Contact

For issues or questions, open a GitHub issue or contact malabsi034@gmail.com