import express from 'express';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const redis = new Redis( 'redis://localhost:6379' );

// For Redis
app.get('/redis', async(req, res) => {
  const reply = await redis.ping();
  res.json({ redis: reply });  
})

// For Mongo
app.get('/mongo', async(req, res) => {
  const url = 'mongodb://localhost:27017/redis';
  if(mongoose.connection.readyState===0){
    await mongoose.connect(url);
  }
    res.json({ mongo: 'connected', database: mongoose.connection.name });
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});