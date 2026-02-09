import redisClient from "../config/redisConfig.js";

async function getAllSessionsHashes() {
    const allSessions = []
    const iterator = redisClient.scanIterator({
        MATCH: "session:*",
        TYPE: "HASH"
    });

    for await (const keys of iterator) {
        for (const key of keys) {
            const userId = await redisClient.HGET(key, "userId");
            allSessions.push(userId);
        }
    }

    return allSessions;
}

export default getAllSessionsHashes;