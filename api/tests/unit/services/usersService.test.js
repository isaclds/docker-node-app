import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
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

    it("should return an error when the repository fails", async () => {
      UserRepository.findById.mockRejectedValue(new Error("find error"));

      const result = await listOneUsers({ params: { id: 1 } });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.findById).toHaveBeenCalledOnce();
    });
  });

  describe("createUsers", () => {
    const user = makeUser();

    it("should create an user", async () => {
      UserRepository.create.mockResolvedValue(user);
      UserRepository.findByEmail.mockResolvedValue(null);

      const result = await createUsers({ body: user });

      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(UserRepository.create).toHaveBeenCalledOnce();
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
    });

    it("should return an error when email already is registered", async () => {
      UserRepository.findByEmail.mockResolvedValue(user);

      const result = await createUsers({ body: user });
      console.log(result);
      expect(result.success).toBe(false);
      expect(result.status).toBe(409);
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
      expect(UserRepository.create).toHaveBeenCalledTimes(0);
    });

    it("should return an error when repository fails", async () => {
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockRejectedValue(new Error("Create user error"));

      const result = await createUsers({ body: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.create).toHaveBeenCalledOnce();
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
    });

    it("should return an error when required fields are missing", async () => {
      const result = await createUsers({ body: { name: "John" } });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByEmail).toHaveBeenCalledTimes(0);
      expect(UserRepository.create).toHaveBeenCalledTimes(0);
    });

    it("should return an error when the repository returns an invalid response", async () => {
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockResolvedValue({});

      const result = await createUsers({ body: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.create).toHaveBeenCalledOnce();
    });
  });

  describe("login", () => {
    const user = makeUser();

    it("should log the user", async () => {
      UserRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fake-jwt-token");

      const result = await login({ body: user });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBe("fake-jwt-token");
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
      expect(bcrypt.compare).toHaveBeenCalledOnce();
      expect(jwt.sign).toHaveBeenCalledOnce();
    });

    it("should return error when user does not exist", async () => {
      UserRepository.findByEmail.mockResolvedValue(null);

      const result = await login({ body: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
    });

    it("should return an error when the password is wrong", async () => {
      UserRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      const result = await login({
        body: { email: user.email, password: "strongPassword" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
    });

    it("should return an error when repository fails", async () => {
      UserRepository.findByEmail.mockRejectedValue(new Error("login error"));

      const result = await login({ body: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.findByEmail).toHaveBeenCalledOnce();
    });

    it("should return an error when required fields are missing", async () => {
      const result = await login({ body: { email: user.email } });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByEmail).toHaveBeenCalledTimes(0);
    });
  });

  describe("changePassword", () => {
    const user = makeUser();

    it("should change the user password", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue("hashed-new-password");
      UserRepository.updatePassword.mockResolvedValue({
        ...user,
        password: "hashed-new-password",
      });

      const result = await changePassword({
        body: { password: "newPassword" },
        user: user,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
      expect(bcrypt.compare).toHaveBeenCalledOnce();
      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", 10);
      expect(UserRepository.updatePassword).toHaveBeenCalledOnce();
    });

    it("should return an error when password isn't at least 8 characters long", async () => {
      const result = await changePassword({
        body: { password: "passwor" },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
      expect(UserRepository.updatePassword).toHaveBeenCalledTimes(0);
    });

    it("should return error when user does not exist", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(null);

      const result = await changePassword({ body: user, user: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return an error when the new password is the same as the actual", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);

      const result = await changePassword({
        body: { password: user.password },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(409);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
      expect(bcrypt.compare).toHaveBeenCalledOnce();
      expect(UserRepository.updatePassword).toHaveBeenCalledTimes(0);
    });

    it("should return an error when the repository fails to change password", async () => {
      UserRepository.findByIdWithPassword.mockRejectedValue(
        new Error("update password error"),
      );

      const result = await changePassword({
        body: { password: user.password },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return an error when required fields are missing", async () => {
      const result = await changePassword({ body: {}, user: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
    });

    it("should return an error when the repository fails to update password", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue("hashed-new-password");
      UserRepository.updatePassword.mockResolvedValue(null);

      const result = await changePassword({
        body: { password: "newPassword" },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.updatePassword).toHaveBeenCalledOnce();
    });
  });

  describe("updateUser", () => {
    const user = makeUser();

    it("should update user email", async () => {
      const updatedUser = { ...user, email: "new@email.com" };

      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.update.mockResolvedValue(updatedUser);

      const result = await updateUser({
        body: { update: { email: "new@email.com" } },
        user: user,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data.email).toBe("new@email.com");
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
      expect(UserRepository.findByEmail).toHaveBeenCalledWith("new@email.com");
      expect(UserRepository.update).toHaveBeenCalledWith(user.id, {
        email: "new@email.com",
      });
    });

    it("should update user name", async () => {
      const updatedUser = { ...user, name: "new-name" };

      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      UserRepository.update.mockResolvedValue(updatedUser);

      const result = await updateUser({
        body: { update: { name: "new-name" } },
        user: user,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data.name).toBe("new-name");
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
      expect(UserRepository.update).toHaveBeenCalledWith(user.id, {
        name: "new-name",
      });
    });

    it("should return an error when there is invalid fields to update", async () => {
      const result = await updateUser({
        body: { update: { password: "new-password" } },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
    });

    it("should return an error when there isn't fields to update", async () => {
      const result = await updateUser({
        body: {},
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
    });

    it("should return error when user does not exist", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(null);

      const result = await updateUser({
        body: { update: { email: "new@email.com" } },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return an error when the email already exists", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      UserRepository.findByEmail.mockResolvedValue(true);

      const result = await updateUser({
        body: { update: { email: "new@email.com" } },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(409);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
      expect(UserRepository.findByEmail).toHaveBeenCalledWith("new@email.com");
    });

    it("should return an error when the repository fails to update", async () => {
      UserRepository.findByIdWithPassword.mockRejectedValue(
        new Error("update error"),
      );

      const result = await updateUser({
        body: { update: { email: "new@email.com" } },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return an error when required fields are missing", async () => {
      const result = await updateUser({ body: {}, user: user });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
    });

    it("should return an error when the repository fails to update", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.update.mockRejectedValue(new Error("update error"));

      const result = await updateUser({
        body: { update: { email: "new@email.com" } },
        user: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.update).toHaveBeenCalledOnce();
    });
  });

  describe("deleteUser", () => {
    const user = makeUser();

    it("should delete user", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);

      const result = await deleteUser({
        params: { id: 1 },
        user: user,
        body: { email: user.email, password: user.password },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(204);
      expect(bcrypt.compare).toHaveBeenCalledOnce();
      expect(bcrypt.compare).toHaveBeenCalledWith(user.password, user.password);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return error when user does not exist", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(null);

      const result = await deleteUser({
        params: { id: 1 },
        user: user,
        body: { email: user.email, password: user.password },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return error when the provided email match doesn't match the users email", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);

      const result = await deleteUser({
        params: { id: 1 },
        user: user,
        body: { email: "dif@email.com", password: user.password },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return an error when the password is wrong", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      const password = "wrongPassword";

      const result = await deleteUser({
        params: { id: 1 },
        user: user,
        body: { email: user.email, password: password },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(401);
      expect(bcrypt.compare).toHaveBeenCalledOnce();
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });

    it("should return an error when the repository fails to delete", async () => {
      UserRepository.findByIdWithPassword.mockRejectedValue(
        new Error("delete error"),
      );

      const result = await deleteUser({
        params: { id: 1 },
        user: user,
        body: user,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledOnce();
    });
    it("should return an error when the user ID was not provided", async () => {
      const result = await deleteUser({
        params: {},
        user: user,
        body: { email: user.email, password: user.password },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
    });

    it("should return an error when the provided token isn't right", async () => {
      const result = await deleteUser({
        params: { id: 1 },
        user: { id: 999 },
        body: { email: user.email, password: user.password },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(403);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
    });

    it("should return an error when required fields are missing", async () => {
      const result = await deleteUser({
        params: { id: 1 },
        user: user,
        body: {},
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(UserRepository.findByIdWithPassword).toHaveBeenCalledTimes(0);
    });

    it("should return an error when the repository fails to delete", async () => {
      UserRepository.findByIdWithPassword.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      UserRepository.delete.mockRejectedValue(new Error("delete error"));

      const result = await deleteUser({
        params: { id: 1 },
        user: user,
        body: { email: user.email, password: user.password },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
      expect(UserRepository.delete).toHaveBeenCalledOnce();
    });
  });
});
