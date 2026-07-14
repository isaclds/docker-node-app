export default function removePassword(obj) {
  if (!obj) return null;

  const plain = typeof obj.toJSON === "function" ? obj.toJSON() : obj;
  const { password, ...userWithoutPassword } = plain;
  return userWithoutPassword;
}
