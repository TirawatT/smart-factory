import { IUserRepository } from "../repositories";
import {
  User,
  UserWithPassword,
  CreateUserInput,
  UpdateUserInput,
} from "@/types";
import { mockUsers } from "./data/users";
import { v4 as uuidv4 } from "uuid";

const users = [...mockUsers];

export const mockUserRepository: IUserRepository = {
  async findAll(): Promise<User[]> {
    return users.map(({ passwordHash: _, ...user }) => user);
  },

  async findById(id: string): Promise<User | null> {
    const user = users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...rest } = user;
    return rest;
  },

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return users.find((u) => u.email === email) || null;
  },

  async create(data: CreateUserInput): Promise<User> {
    const newUser: UserWithPassword = {
      id: `usr_${uuidv4().slice(0, 8)}`,
      email: data.email,
      name: data.name,
      roleId: data.roleId,
      passwordHash: data.password,
      isActive: true,
      lastActiveAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    const { passwordHash: _, ...rest } = newUser;
    return rest;
  },

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    users[index] = { ...users[index], ...data, updatedAt: new Date() };
    const { passwordHash: _, ...rest } = users[index];
    return rest;
  },

  async delete(id: string): Promise<void> {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    users[index].isActive = false;
    users[index].updatedAt = new Date();
  },
};
