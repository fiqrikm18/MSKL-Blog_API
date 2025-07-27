export class ArticleNotFoundException extends Error {
  private readonly code = 404;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ArticleNotFoundException.prototype);
  }

  public getCode(): number {
    return this.code;
  }
}

