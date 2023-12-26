export class Admin {
  constructor(
    public readonly adminId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
