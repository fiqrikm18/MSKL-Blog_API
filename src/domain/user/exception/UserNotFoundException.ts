export class UserNotFoundException extends Error {

  private code: number = 404;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }

  public getCode(): number {
    return this.code;
  }

}
