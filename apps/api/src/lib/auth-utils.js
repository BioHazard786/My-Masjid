export async function hash(password) {
    const enc = new TextEncoder();
    // 1. Generate a random salt
    // A salt prevents two identical passwords from having the same hash
    const salt = crypto.getRandomValues(new Uint8Array(16));
    // 2. Define the parameters for PBKDF2
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
    // Iterations determine the "work factor". Start here and adjust.
    // 100,000 is a reasonable starting point for performance testing.
    const iterations = 10000;
    // 3. Derive the key (the actual hash)
    const hashBuffer = await crypto.subtle.deriveBits({
        name: "PBKDF2",
        salt: salt,
        iterations: iterations,
        hash: "SHA-256",
    }, keyMaterial, 256 // 256 bits for the hash length
    );
    // 4. Convert salt and hash to hex strings for storage
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const saltHex = Array.from(salt)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    // 5. Store in a single string: "iterations:salt:hash"
    // This format makes it easy to verify later.
    return `${iterations}:${saltHex}:${hashHex}`;
}
export async function verify({ password, hash, }) {
    const enc = new TextEncoder();
    // 1. Deconstruct the stored hash string
    const [iterationsStr, saltHex, hashHex] = hash.split(":");
    if (!iterationsStr || !saltHex || !hashHex) {
        return false; // Invalid hash format
    }
    const iterations = parseInt(iterationsStr, 10);
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    // 2. Hash the incoming password using the *exact same* salt and iterations
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
    const hashBuffer = await crypto.subtle.deriveBits({
        name: "PBKDF2",
        salt: salt,
        iterations: iterations,
        hash: "SHA-256",
    }, keyMaterial, 256);
    // 3. Compare the newly generated hash with the stored hash
    const newHashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    // Use crypto.timingSafeEqual for a secure comparison to prevent timing attacks
    const storedHashBuffer = new Uint8Array(hashHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const newHashBuffer = new Uint8Array(newHashHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    if (storedHashBuffer.length !== newHashBuffer.length) {
        return false;
    }
    return crypto.subtle.timingSafeEqual(storedHashBuffer, newHashBuffer);
}
