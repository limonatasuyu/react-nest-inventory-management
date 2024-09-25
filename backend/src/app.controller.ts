import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('metrics')
  async getMetrics() {
    return await this.appService.getMetrics();
  }

  @Get('updates')
  async getUpdates() {
    return await this.appService.getRecentActivity();
  }
}
