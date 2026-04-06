export default function removePassword(obj) {
  if (!obj) return null;

  const { password, ...userWithoutPassword } = obj.toJSON();
  return userWithoutPassword;
}
