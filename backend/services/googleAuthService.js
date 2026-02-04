import { OAuth2Client } from "google-auth-library";
import { config } from "../config/config.js";

const client = new OAuth2Client({
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
});

export async function verifyIdToken(idToken) {
    const loginTicket = await client.verifyIdToken({
        idToken,
        audience: config.googleClientId
    });

    const userData = loginTicket.getPayload();

    return userData;
}