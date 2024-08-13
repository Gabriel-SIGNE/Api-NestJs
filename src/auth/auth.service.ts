import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/User';
import { Model } from 'mongoose';
import { userDto } from './models/UserDto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    // inscription
    async signUp(userInfo: userDto): Promise<{ token: string }> {
        const { email, password } = userInfo;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            email,
            password: hashedPassword
        });

        const token = await this.jwtService.sign({ userId: user._id });
        return { token };
    }

    // se connecter
    async login(userInfo: userDto): Promise<{ token: string, userid: string }> {
        const { email, password } = userInfo;

        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException('Paire login/mot de passe incorrecte 1');
        }

        const correctPasswrd = await bcrypt.compare(password, user.password);

        if (!correctPasswrd) {
            throw new UnauthorizedException('Paire login/mot de passe incorrecte 2');
        }

        const token = await this.jwtService.sign({ userId: user._id, secret: jwtConstants.secret });

        const userId = String(user._id);

        return {token: token, userid: userId } ;
    }
}
