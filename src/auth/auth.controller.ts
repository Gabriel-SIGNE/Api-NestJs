import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { userDto } from './models/UserDto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @Post('/signup')
    async signUp(@Body() signUpUser: userDto): Promise<{ token: string }> {
        return await this.authService.signUp(signUpUser);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async signIn(@Body() loginUser: userDto) {
        const data = await this.authService.login(loginUser);

        return {
            statusCode: HttpStatus.OK,
            message:"Authentication Success",
            token: data.token,
            userId: data.userid
        }
    }
}
