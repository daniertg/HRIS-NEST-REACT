import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('position') position: string,
    @Body('password') password: string,
  ) {
    const result = await this.auth.register(name, email, phoneNumber, position, password);
    return {
      success: true,
      message: 'User registered successfully',
      data: result
    };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const result = await this.auth.login(email, password);
    return {
      success: true,
      message: 'Login successful',
      access_token: result.access_token,
      user: result.user
    };
  }
}
