interface User {
  id: string;
  email: string;
  password: string;
}

const USER_ID_LENGTH = 24;
const NO_USER_FOUND = 'NO_USER_FOUND'

class MockedUserService {
  private users: User[] = [];

  createUser(email: string, password: string) {
    const createdUser: User = {
      id: this.createObjectId(),
      email: email,
      password: password,
    };
    this.users.push(createdUser);

    return {
      id: createdUser.id,
      email: createdUser.email,
    };
  }

  isEmailInUse(email: string): boolean {
    return this.users.find((user) => user.email === email) !== undefined;
  }

  verify(email: string, password: string): boolean {
    return (
      this.users.find(
        (user) => user.email === email && user.password === password
      ) !== undefined
    );
  }

  getIdForUserWithCredentials(email: string, password: string): string {
    const id = this.users.find((user) => user.email === email && user.password === password)?.id
    if (id === undefined) return NO_USER_FOUND
    return id
  }

  private createObjectId(): string {
    const hexCharacters = "0123456789abcdef";
    let id = "";
    for (let i = 0; i < USER_ID_LENGTH; i++) {
      id += hexCharacters[Math.floor(Math.random() * hexCharacters.length)];
    }

    return id;
  }
}

export default MockedUserService;
