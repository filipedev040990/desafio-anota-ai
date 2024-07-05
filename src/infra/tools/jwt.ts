import { JwtInterface } from '@/domain/interfaces/tools/jwt.adapter.interface'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements JwtInterface {
  constructor (
    private readonly secretKey: string,
    private readonly expiresIn: string
  ) {}

  async sign (payload: object): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn })
  }

  async verify (token: string): Promise<string | object | null> {
    try {
      return jwt.verify(token, this.secretKey)
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
