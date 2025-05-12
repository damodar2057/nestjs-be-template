// 

import { Injectable, Logger } from "@nestjs/common";
import { JwksClient } from "jwks-rsa";
import * as jwt from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtUtil {
  private readonly logger = new Logger(JwtUtil.name);
  private readonly client: JwksClient;

  constructor(
    private configService: ConfigService
  ) {
    this.client = new JwksClient({
      jwksUri: this.configService.get<string>('app.jwksUri'),
      requestHeaders: {},
      timeout:  +this.configService.get<number>('app.jwksConnTimeout') // 30s timeout
    });
  }

  private getSigningKey(header): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(header.kid, (err, key) => {
        if (err) {
          this.logger.error(`Error fetching signing key: ${err}`);
          return reject(err);
        }
        
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  }

  public async validateToken(token: string): Promise<any> {
    try {
      return await new Promise((resolve, reject) => {
        jwt.verify(token, async (header, callback) => {
          try {
            const key = await this.getSigningKey(header);
            callback(null, key);
          } catch (err) {
            callback(err, null);
          }
        }, { algorithms: ["RS256"] }, (err, decoded) => {
          if (err) {
            this.logger.error("JWT verification failed", err);
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });
    } catch (error) {
      this.logger.error(`Token validation failed: ${error}`);
      throw error;
    }
  }
}