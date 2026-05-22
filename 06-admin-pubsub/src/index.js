import express from "express";
import Redis from "ioredis";

const app = express();
app.use( express.json() );

const publisher = new Redis( process.env.REDIS_URL || "redis://localhost:6379" );

app.post('/admin-notifications', ( req, res ) => {
    const payload = {
        title: req.body.title || "Default Title",
        createdAt : new Date().toISOString()
    }
    const receivers = publisher.publish( "admin-notifications", JSON.stringify( payload ) );
    res.status(200).json({ message: "Notification published", receivers });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});