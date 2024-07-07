import { JwtInterface } from '@/domain/interfaces/tools/jwt.adapter.interface'
import jwt, { JwtPayload } from 'jsonwebtoken'

export class JwtAdapter implements JwtInterface {
  constructor (
    private readonly secretKey: string,
    private readonly expiresIn: string
  ) {}

  async sign (payload: object): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn })
  }

  async verify (token: string): Promise<JwtPayload | null> {
    try {
      return jwt.verify(token, this.secretKey) as JwtPayload
    } catch (error) {
      console.error('Error verifying JWT:', error)
      return null
    }
  }
}
