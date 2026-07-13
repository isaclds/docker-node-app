export const makeUser = (overrides = {}) => ({
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  password: "12345678",
  ...overrides,
});
