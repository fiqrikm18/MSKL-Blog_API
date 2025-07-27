export class UserAlreadyExistsException extends Error {

  private readonly code: number = 400;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UserAlreadyExistsException.prototype);
  }

  public getCode(): number {
    return this.code;
  }

}

export class UserNotFoundException extends Error {

  private readonly code: number = 404;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }

  public getCode(): number {
    return this.code;
  }

}
