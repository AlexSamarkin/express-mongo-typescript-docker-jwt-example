export abstract class ValueObject<T> {
  protected readonly _value: T;
  constructor(value: T) {
    if (!this.validate(value)) {
      throw new Error("Provided value is not valid");
    }
    this._value = value;
  }

  protected abstract validate(value: T): boolean;

  get value(): T {
    return this._value;
  }
}
