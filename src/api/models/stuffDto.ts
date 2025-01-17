import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class StuffDto {
    // @IsNotEmpty()
    // @IsString()
    // _id: string;

    // @IsEmpty({ message: "You cannot pass user id" })
    // @IsString()
    // userId: string;

    @ApiProperty({
        description: 'The title of the stuff',
        example: 'Vintage Guitar',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Detailed description of the stuff',
        example: 'A beautiful vintage guitar from 1975 in perfect condition',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'URL of the image representing the stuff',
        example: 'https://example.com/images/vintage-guitar.jpg',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @ApiProperty({
        description: 'Price of the stuff',
        example: 1299.99,
        required: true,
        type: Number
    })
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