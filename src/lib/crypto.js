import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

export const encrypt = (text) => {
  // 1. Basic input check
  if (!text) return '';
  
  // 2. Security Check (Crucial!)
  // If the .env file is not loaded, this will tell you immediately.
  if (!SECRET_KEY) {
    console.error("⛔️ [Crypto Error] FATAL: Missing Encryption Key! Check your .env file and restart the terminal.");
    return null; // Return null so App.js knows to stop
  }

  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (err) {
    console.error("⛔️ [Crypto Error] Encryption failed:", err);
    return null;
  }
};

export const decrypt = (cipherText) => {
  if (!cipherText) return '';
  
  if (!SECRET_KEY) {
    console.warn("⚠️ [Crypto Warning] Attempting to decrypt without a key.");
    return "Key Missing";
  }

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // If the result is empty, it usually means the Wrong Key was used
    if (!originalText) return "⚠️ Decrypt Failed";
    
    return originalText;
  } catch (error) {
    console.error("Decryption Crash:", error);
    return "⚠️ Error";
  }
};