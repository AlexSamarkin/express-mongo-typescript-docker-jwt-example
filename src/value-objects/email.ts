import { ValueObject } from "./value-object";

export class Email extends ValueObject<string> {
  protected validate(value: string): boolean {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      value
    );
  }
}
