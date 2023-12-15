import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';

const testUsers = [
  {
    username: 'xzxldl',
    password: '123',
    email: 'xzxldl@gmail.com',
  },
  {
    username: 'admin',
    password: 'admin',
    email: 'admin@gmail.com',
  },
];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 注入 JWT 服务
  @Inject(JwtService)
  private jwtService: JwtService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body() userDto: UserDto) {
    const user = testUsers.find((v) => v.username === userDto.username);

    if (!user) {
      throw new BadRequestException('未找到该用户');
    }

    if (user.password !== userDto.password) {
      throw new BadRequestException('密码错误！');
    }

    const accessToken = this.jwtService.sign(
      {
        username: user.username,
        email: user.email,
      },
      {
        expiresIn: '0.5h',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        username: user.username,
      },
      {
        expiresIn: '3d',
      },
    );

    return {
      userInfo: {
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  @Get('getInfo')
  getInfo(@Req() req: Request) {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);

      return data;
    } catch (e) {
      throw new UnauthorizedException(`token 失效，重新登录：`, e);
    }
  }

  @Get('refresh')
  refresh(@Query('token') token: string) {
    try {
      const data = this.jwtService.verify(token);

      const user = testUsers.find((v) => v.username === data.username);

      return {
        accessToken: this.jwtService.sign(
          {
            username: user.username,
            email: user.email,
          },
          {
            expiresIn: '0.5h',
          },
        ),
        refreshToken: this.jwtService.sign(
          {
            username: user.username,
          },
          {
            expiresIn: '3d',
          },
        ),
      };
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
