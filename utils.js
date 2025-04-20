function getRoomInfo(docName) {
    const [projectId, branchId, fileId] = docName.split('/');
    return { projectId, branchId, fileId };
  }
  
  module.exports = { getRoomInfo };