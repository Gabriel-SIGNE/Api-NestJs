import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserDto } from './models/UserDto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';


class TokenResponse {
    @ApiProperty({
        description: 'JWT token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;
}

class LoginResponse {
    @ApiProperty({
        description: 'HTTP Status code',
        example: 200,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Response message',
        example: 'Authentication Success',
    })
    message: string;

    @ApiProperty({
        description: 'JWT token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;

    @ApiProperty({
        description: 'ID of the authenticated user',
        example: '507f1f77bcf86cd799439011',
    })
    userId: string;
}

// Error response classes
class BadRequestError {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: "Email already exists" })
    message: string;

    @ApiProperty({ example: "Bad Request" })
    error: string;
}

class UnauthorizedError {
    @ApiProperty({ example: 401 })
    statusCode: number;

    @ApiProperty({ example: "Invalid credentials" })
    message: string;

    @ApiProperty({ example: "Unauthorized" })
    error: string;
}

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
    constructor( private authService: AuthService) {}

    @ApiOperation({ 
        summary: 'Register a new user',
        description: 'Creates a new user account with the provided email and password'
    })
    @ApiBody({ 
        type: UserDto,
        description: 'User credentials for registration'
    })
    @ApiCreatedResponse({
        description: 'User successfully registered',
        type: TokenResponse,
    })
    @ApiBadRequestResponse({
        description: 'Registration failed',
        type: BadRequestError,
        schema: {
            example: {
                statusCode: 400,
                message: 'Email already exists',
                error: 'Bad Request'
            }
        }
    })
    @Post('/signup')
    async signUp(@Body() signUpUser: UserDto): Promise<{ token: string }> {
        return await this.authService.signUp(signUpUser);
    }


    @ApiOperation({ 
        summary: 'Login with existing credentials',
        description: 'Authenticates a user and returns a JWT token'
    })
    @ApiBody({ 
        type: UserDto,
        description: 'User credentials for login'
    })
    @ApiOkResponse({
        description: 'User successfully authenticated',
        type: LoginResponse,
        schema: {
            example: {
                statusCode: 200,
                message: "Authentication Success",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                userId: "507f1f77bcf86cd799439011"
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'Authentication failed',
        type: UnauthorizedError,
        schema: {
            example: {
                statusCode: 401,
                message: "Invalid credentials",
                error: "Unauthorized"
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async signIn(@Body() loginUser: UserDto) {
        const data = await this.authService.login(loginUser);

        return {
            statusCode: HttpStatus.OK,
            message:"Authentication Success",
            token: data.token,
            userId: data.userid
        }
    }
}
