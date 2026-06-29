import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/repositories/UserRepository.js', () => ({
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

import { listAllUsers, listOneUsers } from '../../../src/services/usersService.js';
import UserRepository from '../../../src/repositories/UserRepository.js';

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listAllUsers', () => {
    it('should list all users', async () => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
      ];

      UserRepository.findAllUsers.mockResolvedValue(users);

      const result = await listAllUsers({ user: { id: 1 } });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(users);
      expect(UserRepository.findAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('listOneUsers', () => {
    it('should list one user by ID', async () => {
      const user = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };

      UserRepository.findById.mockResolvedValue(user);

      const result = await listOneUsers({ params: { id: 1 } });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(user);
      expect(UserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return error when user does not exist', async () => {
      UserRepository.findById.mockResolvedValue(null);

      const result = await listOneUsers({ params: { id: 999 } });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });
  });
});