export class AuthenticationException extends Error {
  private readonly code: number = 403;

  constructor(message: string = "Authentication failed") {
    super(message);
    Object.setPrototypeOf(this, AuthenticationException.prototype);
  }

  public getCode(): number {
    return this.code;
  }
}

export class UserNotAuthenticatedException extends Error {
  private readonly code: number = 401;

  constructor(message: string = "User is not authenticated") {
    super(message);
    Object.setPrototypeOf(this, UserNotAuthenticatedException.prototype);
  }

  public getCode(): number {
    return this.code;
  }
}
