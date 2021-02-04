import { ValueObject } from "./value-object";

export class Login extends ValueObject<string> {
  protected validate(value: string): boolean {
    return /^([a-zA-Z0-9_-]){3,20}$/.test(value);
  }
}
