export interface AuthenticateUseCaseInterface {
  execute: (document: string, password: string) => Promise<{accessToken: string}>
}
