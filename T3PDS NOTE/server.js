const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('.'));

app.get('/songs', (req, res) => {
    const songDir = path.join(__dirname, 'song');
    fs.readdir(songDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read songs directory' });
        }
        
        const mp3Files = files
            .filter(file => path.extname(file).toLowerCase() === '.mp3')
            .map(file => ({
                title: path.parse(file).name,
                artist: 'Unknown Artist',
                file: file
            }));
            
        res.json(mp3Files);
    });
});

app.listen(port, () => {
    console.log(`MP3 player server running at http://localhost:${port}`);
});