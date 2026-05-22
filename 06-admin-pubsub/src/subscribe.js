import Redis from "ioredis";

const subscriber = new Redis( process.env.REDIS_URL || "redis://localhost:6379" );

subscriber.subscribe( "admin-notifications", ( err, count ) => {
    if ( err ) {
        console.error( "Failed to subscribe: %s", err.message );
    } else {
        console.log( "Successfully subscribed to admin-notifications" );
    }
} );

subscriber.on( "message", ( channel, message ) => {
    console.log("received on", channel, ":", JSON.parse( message ) );
} );