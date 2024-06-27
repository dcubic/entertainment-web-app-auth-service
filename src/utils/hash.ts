import bcrypt from "bcrypt";

function hash(password: string) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

function verifyHashSource(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export { hash, verifyHashSource }
