require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// Configure Multer for file uploads (storing temporarily on local disk)
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Credentials Path
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
let oauth2Client;

try {
    const creds = fs.readFileSync(CREDENTIALS_PATH);
    const { client_secret, client_id, redirect_uris } = JSON.parse(creds).web || JSON.parse(creds).installed;
    const redirectUri = (redirect_uris && redirect_uris[0]) ? redirect_uris[0] : 'http://localhost:3000/oauth2callback';
    oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);
} catch (error) {
    console.error('Error loading credentials.json - please make sure it exists and is correctly configured:', error.message);
}

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly'];

// Generate an Auth URL
app.get('/auth', (req, res) => {
    if (!oauth2Client) return res.status(500).send('OAuth2 Client not initialized. Check credentials.json');
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// OAuth Callback
app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send('No code provided');

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // Normally, you'd save these tokens to a database here
        res.redirect('/?loggedin=true');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.status(500).send('Error retrieving access token');
    }
});

// API to check login status
app.get('/api/status', (req, res) => {
    const isLogged = oauth2Client && oauth2Client.credentials && oauth2Client.credentials.access_token;
    res.json({ loggedIn: !!isLogged });
});

// List Files
app.get('/api/drive/files', async (req, res) => {
    try {
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name, mimeType)',
        });
        res.json({ files: response.data.files });
    } catch (error) {
        console.error('The API returned an error: ' + error);
        res.status(500).send('Error listing files');
    }
});

// Upload File
app.post('/api/drive/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        
        const fileMetadata = {
            name: req.file.originalname,
        };
        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path),
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Clean up temporary local file
        fs.unlinkSync(req.file.path);

        res.json({ message: 'File uploaded successfully', fileId: file.data.id });
    } catch (error) {
        console.error('The API returned an error:', error);
        res.status(500).send('Error uploading file');
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
    console.log(`Remember to setup credentials.json from GCC and configure authorized redirect URI to http://localhost:${port}/oauth2callback`);
});
