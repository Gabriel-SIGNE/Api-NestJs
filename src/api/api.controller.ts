import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { avisDto, stuffDto } from './models/stuffDto';
import { stuff } from './models/Stuff';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongoose';

@Controller('api/stuff')
export class ApiController {
    constructor(private service: ApiService) { }

    @Get()
    // @UseGuards(AuthGuard())
    async getAll(): Promise<stuff[]> {
        return this.service.getAllThing();
    }

    @Get(':id')
    // @UseGuards(AuthGuard())
    async getOne(@Param('id') Id: string): Promise<stuff> {
        return this.service.getOneThing(Id);
    }

    @Post()
    // @UseGuards(AuthGuard())
    async post(@Body() createStuffDto: stuffDto, @Res() message, @Req() req): Promise<stuff> {
        console.log(req.userId)
        try {
            this.service.postThing(createStuffDto, req.userId);
            return message.json({
                statusCode: HttpStatus.CREATED,
                message: "Object saved successfully !"
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete(':id')
    // @UseGuards(AuthGuard())
    async del(@Param('id') Id: string, @Res() message): Promise<stuff> {
        this.service.deleteThing(Id);
        return message.json({
            statusCode: HttpStatus.OK,
            message: "object deleted successfully !"
        });
    }

    @Put(':id')
    // @UseGuards(AuthGuard())
    async put(@Param('id') id: string,@Body() thing: stuffDto): Promise<stuff> {
        return this.service.modifyThing(id, thing);
    }

    @Post('/avis')
    async postAvis( @Body() crateAvis: avisDto) {
        try {
            this.service.postAvis(crateAvis);
            return {
                statusCode: HttpStatus.CREATED,
                message: "Object saved successfully !"
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/avis/:id')
    async getAvis (@Param('id') id: ObjectId) {
        return this.service.getAvis(id);
    }
}