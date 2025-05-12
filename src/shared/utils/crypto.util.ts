import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionUtil {
  private readonly logger = new Logger(EncryptionUtil.name);

  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey: string;
  private readonly ivLength = 16; // Initialization vector length for AES

  constructor(private configService: ConfigService) {
    // Retrieve secret key from config or environment variable
    this.secretKey =
      this.configService.get<string>('app.encryptionSecretKey') ||
      'your-secret-key';
  }

  /**
   * Hashes the dynamic secret key to produce a fixed 32-byte key.
   */
  private getHashedKey(): Buffer {
    return crypto.createHash('sha256').update(this.secretKey).digest();
  }

  private generateIV(): Buffer {
    return crypto.randomBytes(this.ivLength); // Generate a random IV
  }

  /**
   * Encrypts the provided text.
   * Returns a string containing Base64-encoded IV and encrypted data separated by a colon.
   */
  // public encrypt(text: string): string {
  //   try {
  //     const iv = this.generateIV();
  //     const hashedKey = this.getHashedKey();
  //     const cipher = crypto.createCipheriv(this.algorithm, hashedKey, iv);
  //     let encrypted = cipher.update(text, 'utf8', 'hex');
  //     encrypted += cipher.final('hex');

  //     // Base64 encode the IV and the encrypted text for URL-safe usage
  //     const ivBase64 = iv.toString('base64');
  //     const encryptedBase64 = Buffer.from(encrypted, 'hex').toString('base64');
  //     return `${ivBase64}:${encryptedBase64}`;
  //   } catch (err) {
  //     this.logger.error('Encryption failed', err);
  //     throw new Error('Encryption failed');
  //   }
  // }

  public encrypt(text: string): string {
    try {
      const iv = this.generateIV();
      const hashedKey = this.getHashedKey();
      const cipher = crypto.createCipheriv(this.algorithm, hashedKey, iv);
      
      // Add expiration timestamp (5 minutes from now)
      const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
      const dataWithExpiry = JSON.stringify({
        data: text,
        expiresAt: expiryTime
      });

      let encrypted = cipher.update(dataWithExpiry, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Base64 encode the IV and the encrypted text for URL-safe usage
      const ivBase64 = iv.toString('base64');
      const encryptedBase64 = Buffer.from(encrypted, 'hex').toString('base64');
      return `${ivBase64}:${encryptedBase64}`;
    } catch (err) {
      this.logger.error('Encryption failed', err);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypts the provided encrypted text.
   * The text should be in the format "iv:encryptedData", where both parts are Base64 encoded.
   */
  // public decrypt(encryptedText: string): string {
  //   try {
  //     const textParts = encryptedText.split(':');
  //     const iv = Buffer.from(textParts.shift(), 'base64');
  //     const encryptedData = Buffer.from(textParts.join(':'), 'base64').toString(
  //       'hex',
  //     );

  //     const hashedKey = this.getHashedKey();
  //     const decipher = crypto.createDecipheriv(this.algorithm, hashedKey, iv);
  //     let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  //     decrypted += decipher.final('utf8');
  //     return decrypted;
  //   } catch (err) {
  //     this.logger.error('Decryption failed', err);
  //     throw new Error('Decryption failed');
  //   }
  // }

  public decrypt(encryptedText: string): string {
    try {
      const textParts = encryptedText.split(':');
      const iv = Buffer.from(textParts.shift(), 'base64');
      const encryptedData = Buffer.from(textParts.join(':'), 'base64').toString('hex');

      const hashedKey = this.getHashedKey();
      const decipher = crypto.createDecipheriv(this.algorithm, hashedKey, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      // Parse the decrypted data and check expiration
      const parsedData = JSON.parse(decrypted);
      if (Date.now() > parsedData.expiresAt) {
        throw new Error('Encrypted data has expired');
      }

      return parsedData.data;
    } catch (err) {
      this.logger.error('Decryption failed', err);
      throw new Error('Decryption failed');
    }
  }

}
