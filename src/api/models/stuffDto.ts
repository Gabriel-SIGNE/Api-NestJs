import { IsEmpty, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class stuffDto {
    // @IsNotEmpty()
    // @IsString()
    // _id: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    // @IsEmpty({ message: "You cannot pass user id" })
    // @IsString()
    // userId: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}

export class avisDto {
    @IsObject({each:true})
    stuffId: ObjectId;

    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsString()
    comment: string;
}