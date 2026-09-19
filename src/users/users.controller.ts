import { Controller, Get, Inject } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  // নোট: tsx/esbuild 'emitDecoratorMetadata' জেনারেট করতে পারে না,
  // তাই NestJS-এর DI-তে টোকেন এক্সপ্লিসিটভাবে দিতে হয় (@Inject)
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }
}
