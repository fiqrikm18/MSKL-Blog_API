export class UserAlreadyExistsException extends Error {

  private code: number = 400;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UserAlreadyExistsException.prototype);
  }

  public getCode(): number {
    return this.code;
  }

}
