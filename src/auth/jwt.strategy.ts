import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./models/User";
import { Model } from "mongoose";
import { jwtConstants } from "./constants";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret
        })
    }

    async validate(payload: Record<string, any>) {
         const user = await this.userModel.findById(payload.userId);

         if(!user) {
            throw new UnauthorizedException('Login first to access this endpoint.');
         }
         
         return payload;
    }
}