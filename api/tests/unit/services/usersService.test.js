import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createUsers,
  login,
  changePassword,
  listOneUsers, // feito
  updateUser,
  deleteUser,
  listAllUsers, // feito
} from "../../../src/services/usersService.js";
import UserRepository from "../../../src/repositories/UserRepository.js";
import { makeUser } from "../../factories/userFactory.js";

vi.mock("../../../src/repositories/UserRepository.js", () => ({
  default: {
    findById: vi.fn(),
    findAllUsers: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByEmail: vi.fn(),
    findByIdWithPassword: vi.fn(),
    updatePassword: vi.fn(),
  },
}));

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listAllUsers", () => {
    it("should list all users", async () => {
      const users = [
        makeUser(),
        makeUser({ id: 2, name: "Jane Doe", email: "jane.doe@example.com" }),
      ];

      UserRepository.findAllUsers.mockResolvedValue(users);

      const result = await listAllUsers();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(users);
      expect(UserRepository.findAllUsers).toHaveBeenCalledOnce();
    });

    it("should list no users", async () => {
      const users = [];

      UserRepository.findAllUsers.mockResolvedValue(users);

      const result = await listAllUsers();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(users);
      expect(UserRepository.findAllUsers).toHaveBeenCalledOnce();
    });

    it("should return an error when repository fails", async () => {
      UserRepository.findAllUsers.mockRejectedValue(new Error("DB error"));

      const result = await listAllUsers();

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.findAllUsers).toHaveBeenCalledOnce();
    });
  });

  describe("listOneUsers", () => {
    it("should list one user by ID", async () => {
      const user = makeUser();
      UserRepository.findById.mockResolvedValue(user);

      const result = await listOneUsers({ params: { id: 1 } });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(user);
      expect(UserRepository.findById).toHaveBeenCalledWith(1);
      expect(UserRepository.findById).toHaveBeenCalledOnce();
    });

    it("should return an error when the user ID was not provided ", async () => {
      const result = await listOneUsers();

      expect(result.success).toBe(false);
      expect(UserRepository.findById).toHaveBeenCalledTimes(0);
    });

    it("should return error when user does not exist", async () => {
      UserRepository.findById.mockResolvedValue(null);

      const result = await listOneUsers({ params: { id: 999 } });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(UserRepository.findById).toHaveBeenCalledOnce();
    });
  });

  describe("createUsers", () => {
    it.todo("should create an user");
    it.todo("should return an error when email already is registered");
    it.todo("should return an error when repository fails");
  });

  describe("login", () => {
    const user = makeUser();

    it.todo("should log the user");

    it("should return error when user does not exist", async () => {
      UserRepository.findByEmail.mockResolvedValue(null);

      const result = await login({ body: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
    });

    it("should return an error when the password is wrong", async () => {
      UserRepository.findByEmail.mockResolvedValue(user);

      const result = await login({
        body: { email: user.email, password: "strongPassword" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
    });

    it.todo("should return an error when repository fails");
  });

  describe("changePassword", () => {
    const user = makeUser();

    it.todo(
      "should return an error when password isn't at least 8 characters long",
    );

    it("should return error when user does not exist", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(null);

      const result = await changePassword({ body: user, user: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it.todo(
      "should return an error when the new password is the same as the actual",
    );

    it.todo("should return an error when the repository fails to update");
  });
});
