const crypto = require("crypto");
const forge = require("node-forge");

function aesEncryptPlaintext(plaintext) {
  const iv = crypto.randomBytes(12);
  const key = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext, "utf8")), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ciphertext, iv, tag, key };
}

function aesDecrypt(ciphertext, iv, tag, key) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const pt = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return pt.toString("utf8");
}

function generateRsaKeyPair(bits = 2048) {
  const keypair = forge.pki.rsa.generateKeyPair(bits);
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  return { publicKeyPem, privateKeyPem };
}

function rsaEncryptKey(publicKeyPem, bufferKey) {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(bufferKey.toString("binary"), "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha1.create() }
  });
  return Buffer.from(encrypted, "binary");
}

function rsaDecryptKey(privateKeyPem, encryptedBuffer) {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const decrypted = privateKey.decrypt(encryptedBuffer.toString("binary"), "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha1.create() }
  });
  return Buffer.from(decrypted, "binary");
}

module.exports = { aesEncryptPlaintext, aesDecrypt, generateRsaKeyPair, rsaEncryptKey, rsaDecryptKey };
