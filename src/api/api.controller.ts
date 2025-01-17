import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { avisDto, StuffDto } from './models/stuffDto';
import { stuff } from './models/Stuff';
import { ObjectId } from 'mongoose';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { Request } from 'express';
import { ApiProperty, ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiNotFoundResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';


class MessageResponse {
    @ApiProperty({
        description: 'HTTP Status code',
        example: 201
    })
    statusCode: number;

    @ApiProperty({
        description: 'Response message',
        example: 'Object saved successfully !'
    })
    message: string;
}

class ErrorResponse {
    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ example: 'Error message' })
    message: string;

    @ApiProperty({ example: 'Bad Request' })
    error: string;
}

@ApiTags('Stuff')
@Controller('api/stuff')
export class ApiController {
    constructor(private service: ApiService) { }

    @ApiOperation({ 
        summary: 'Get all stuff',
        description: 'Retrieves all stuff items from the database'
    })
    @ApiOkResponse({
        description: 'List of all stuff items',
        type: [StuffDto]
    })
    @Get()
    async getAll(): Promise<stuff[]> {
        return this.service.getAllThing();
    }


    @ApiOperation({ 
        summary: 'Get one stuff item',
        description: 'Retrieves a specific stuff item by ID'
    })
    @ApiParam({
        name: 'id',
        description: 'ID of the stuff item',
        example: '507f1f77bcf86cd799439011'
    })
    @ApiOkResponse({
        description: 'Stuff item found',
        type: StuffDto
    })
    @ApiNotFoundResponse({
        description: 'Stuff item not found'
    })
    @Get(':id')
    async getOne(@Param('id') Id: string): Promise<stuff> {
        return this.service.getOneThing(Id);
    }


    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Create new stuff item',
        description: 'Creates a new stuff item. Requires authentication.'
    })
    @ApiBody({ type: StuffDto })
    @ApiCreatedResponse({
        description: 'Object created successfully',
        type: MessageResponse,
        schema: {
            example: {
                statusCode: 201,
                message: "Object saved successfully !"
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'User not authenticated',
        type: ErrorResponse
    })
    @ApiBadRequestResponse({
        description: 'Invalid input',
        type: ErrorResponse
    })
    @Post()
    @UseGuards(UserJwtAuthGuard)
    async post(
        @Body() createStuffDto: StuffDto,
        @Res() message,
        @Req() req: Request
    ): Promise<stuff> {
        console.log(req.user['userId'])
        try {
            this.service.postThing(createStuffDto, req.user['userId']);
            return message.json({
                statusCode: HttpStatus.CREATED,
                message: "Object saved successfully !"
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @UseGuards(UserJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Delete stuff item',
        description: 'Deletes a specific stuff item. Requires authentication and ownership.'
    })
    @ApiParam({
        name: 'idStuff',
        description: 'ID of the stuff item to delete',
        example: '507f1f77bcf86cd799439011'
    })
    @ApiOkResponse({
        description: 'Object deleted successfully',
        type: MessageResponse,
        schema: {
            example: {
                statusCode: 200,
                message: "object deleted successfully !"
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: 'User not authenticated or not owner',
        type: ErrorResponse
    })
    @ApiNotFoundResponse({
        description: 'Stuff item not found'
    })
    @Delete(':idStuff')
    @UseGuards(UserJwtAuthGuard)
    async del(
        @Param('idStuff') Id: string, 
        @Res() message,
        @Req() req: Request
    ): Promise<stuff> {
        this.service.deleteThing(Id,req.user['userId']);
        return message.json({
            statusCode: HttpStatus.OK,
            message: "object deleted successfully !"
        });
    }


    @UseGuards(UserJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Update stuff item',
        description: 'Updates a specific stuff item. Requires authentication and ownership.'
    })
    @ApiParam({
        name: 'idStuff',
        description: 'ID of the stuff item to update',
        example: '507f1f77bcf86cd799439011'
    })
    @ApiBody({ type: StuffDto })
    @ApiOkResponse({
        description: 'Object updated successfully',
        type: StuffDto
    })
    @ApiUnauthorizedResponse({
        description: 'User not authenticated or not owner',
        type: ErrorResponse
    })
    @ApiNotFoundResponse({
        description: 'Stuff item not found'
    })
    @Put(':idStuff')
    @UseGuards(UserJwtAuthGuard)
    async put(
        @Param('idStuff') id: string,
        @Body() thing: StuffDto,
        @Req() req: Request
    ): Promise<stuff> {
        return this.service.modifyThing(id, thing, req.user['userId']);
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