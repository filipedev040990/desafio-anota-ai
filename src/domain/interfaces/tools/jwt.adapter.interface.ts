export interface JwtInterface {
  sign: (payload: object) => Promise<string>
  verify: (value: string) => Promise<any>
}
