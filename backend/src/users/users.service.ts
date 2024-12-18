import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  async create(createUserDto: CreateUserDto) {
    const user: typeof usersTable.$inferInsert = {
      name: `${createUserDto.firstName} ${createUserDto.lastName}`,
      email: createUserDto.email,
      password: createUserDto.password,
    };

    const insertedUsers = await this.db.insert(usersTable)
      .values(user)
      .returning();

    return insertedUsers[0];
  }

  async findAll() {
    return await this.db.select().from(usersTable);
  }

  async findOneByEmail(email: string) {
    const users = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return users[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData: Partial<typeof usersTable.$inferInsert> = {};

    if (updateUserDto.firstName || updateUserDto.lastName) {
      updateData.name = `${updateUserDto.firstName} ${updateUserDto.lastName}`;
    }

    if (updateUserDto.email) {
      updateData.email = updateUserDto.email;
    }

    const updatedUsers = await this.db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, id))
      .returning();

    return updatedUsers[0];
  }

  async remove(id: number) {
    const deletedUsers = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return deletedUsers[0];
  }
}