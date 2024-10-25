import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('prompt')
  async sendPrompt(@Body('prompt') prompt: string) {
    const response = await this.appService.sendPromptToChatGPT(prompt);
    return { response };
  }
}
