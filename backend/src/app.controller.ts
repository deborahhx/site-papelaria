import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

const db = drizzle(process.env.DATABASE_URL!);


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
