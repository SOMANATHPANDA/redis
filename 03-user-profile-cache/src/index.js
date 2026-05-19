import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/user/:id/json', async (req, res) => {
    const userId = req.params.id;
    const userProfile = req.body;
    await redis.set(`user:${userId}:json`, JSON.stringify(userProfile));
    res.json({ message: 'User profile cached successfully in json format' });
});

app.get('/user/:id/json', async (req, res) => {
    const userId = req.params.id;
    const cachedProfile = await redis.get(`user:${userId}:json`);
    res.json({ userProfile: cachedProfile ? JSON.parse(cachedProfile) : null });
});

app.post('/user/:id/hash', async (req, res) => {
    const userId = req.params.id;
    const userProfile = req.body;
    await redis.hmset(`user:${userId}:hash`, userProfile);
    res.json({ message: 'User profile cached successfully in hash format' });
});

app.get('/user/:id/hash', async (req, res) => {
    const userId = req.params.id;
    const cachedProfile = await redis.hgetall(`user:${userId}:hash`);
    res.json({ userProfile: cachedProfile ? cachedProfile : null });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
