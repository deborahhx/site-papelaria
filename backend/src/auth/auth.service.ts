import { ConflictException, Dependencies, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/sign-in-user.dto';
import * as bcrypt from 'bcrypt';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signUp(signUpUserDto: SignUpUserDto) {
    const { email, password, firstName, lastName } = signUpUserDto;
    
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }


  async signIn(signInUserDto: SignInUserDto) {
    const { email, password } = signInUserDto;
    
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m'
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d'
      })
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const newPayload = { 
        email: payload.email, 
        sub: payload.sub,
        roles: payload.roles
      };
      return {
        access_token: await this.jwtService.signAsync(newPayload, {
          expiresIn: '15m'
        })
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}