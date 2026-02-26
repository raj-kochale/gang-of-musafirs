import Razorpay from "razorpay";

let _instance: Razorpay | null = null;

/**
 * Lazily initialise the Razorpay client so that the
 * module can be imported at build-time without throwing
 * when env vars are missing.
 */
export function getRazorpay(): Razorpay {
    if (!_instance) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            throw new Error(
                "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env.local"
            );
        }
        _instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
    return _instance;
}

export default getRazorpay;
