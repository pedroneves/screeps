//@ts-check
export class ScreepAPIBaseIError extends Error {
  constructor({ message = '' } = {}) {
    super(message);
  }
}

export class MissingTokenError extends ScreepAPIBaseIError {
  constructor() {
    super({ message: 'Missing token' });
  }
}
