import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
  }

  async sendPromptToChatGPT(prompt: string): Promise<string> {
    try {
      const headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };

      const data = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      };

      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl, data, { headers }),
      );

      const chatGPTResponse = response.data.choices[0].message.content;
      return chatGPTResponse;
    } catch (error) {
      console.error(
        'Error communicating with OpenAI:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to get a response from ChatGPT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
