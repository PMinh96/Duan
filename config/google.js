const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const credentials = require('./imagewarehouse-443616-219563694598.json');

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({
  version: 'v3',
  auth: auth,
});

const uploadFileToDrive = async (file) => {
  const fileMetadata = {
    name: file.originalname, 
    mimeType: file.mimetype, 
  };

  const media = {
    body: fs.createReadStream(file.path),
  };

  try {
    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });
    const fileId = res.data.id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    return res.data.webViewLink;
  } catch (err) {
    console.error('Lỗi khi upload ảnh lên Google Drive:', err);
    throw new Error('Không thể tải ảnh lên Google Drive');
  }
};

module.exports = { uploadFileToDrive };
