// filepath: /home/johanmora923/projectA/backend-messajes/index.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173", // Cambia esto a la URL de tu frontend
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS para todas las solicitudes

const pool = mysql.createPool({
    host: 'bwvxcku5txdwk7meiayz-mysql.services.clever-cloud.com',
    user: 'u1xrecofby3ual5y',
    password: 'ZgoqH9tZgXX1XfZroUUj',
    database: 'bwvxcku5txdwk7meiayz',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// Configurar multer para guardar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint para subir la foto de perfil
app.post('/user/upload-profile-photo', upload.single('profile_photo'), async (req, res) => {
    const { userId } = req.body;
    const profilePhotoPath = req.file.path;
    try {
        await pool.query('UPDATE users SET profile_photo = ? WHERE id = ?', [profilePhotoPath, userId]);
        res.status(200).send('Profile photo updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/messages', async (req, res) => {
    const { sender, receiver } = req.query;
    try {
        const [results] = await pool.query(`
            SELECT message.*, users.name AS sender_username, users.profile_photo AS sender_profile_photo
            FROM message
            JOIN users ON message.sender_id = users.id
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY timestamp
        `, [sender, receiver, receiver, sender]);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server errorz');
    }
});

app.post('/messages', async (req, res) => {
    const { sender_id, receiver_id, content, reply_to } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO message (sender_id, receiver_id, content, reply_to) VALUES (?, ?, ?, ?)', [sender_id, receiver_id, content, reply_to]);
        const newMessage = { id: result.insertId, sender_id, receiver_id, content, reply_to, timestamp: new Date() };
        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/contacts', async (req, res) => {
    const { userId } = req.query;
    try {
        const [results] = await pool.query(`
            SELECT id, name, profile_photo
            FROM users 
        `, [userId]);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Endpoint para obtener datos del perfil del usuario
app.get('/user/profile', async (req, res) => {
    const { userId } = req.query;
    try {
        const [results] = await pool.query('SELECT id, name, email, residence, phone, profile_photo, isPhoneVerified FROM users WHERE id = ?', [userId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint para actualizar el perfil del usuario
app.post('/user/update', async (req, res) => {
    const { userId, email, residence, phone } = req.body;
    try {
        await pool.query('UPDATE users SET email = ?, residence = ?, phone = ? WHERE id = ?', [email, residence, phone, userId]);
        res.status(200).send('Profile updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', async ({ sender, receiver }) => {
        socket.join(`${sender}-${receiver}`);
        socket.join(`${receiver}-${sender}`);

        try {
            const [results] = await pool.query(`
                SELECT message.*, users.name AS sender_username, users.profile_photo AS sender_profile_photo
                FROM message
                JOIN users ON message.sender_id = users.id
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
                ORDER BY timestamp
            `, [sender, receiver, receiver, sender]);

            socket.emit('load messages', results);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('/messages', async (message) => {
        const { sender_id, receiver_id, content, reply_to } = message;
        try {
            const [result] = await pool.query('INSERT INTO message (sender_id, receiver_id, content, reply_to) VALUES (?, ?, ?, ?)', [sender_id, receiver_id, content, reply_to]);
            const newMessage = { id: result.insertId, sender_id, receiver_id, content, reply_to, timestamp: new Date() };
            io.to(`${sender_id}-${receiver_id}`).emit('messages', newMessage);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});