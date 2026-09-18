import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Response } from 'express';
import { getAideData } from './aide.data';
import { getAideHtml } from './aide.template';

@ApiTags('Aide')
@Controller('aide')
export class AideController {

    @ApiExcludeEndpoint()
    @Get()
    getAide(@Query('format') format: string, @Res() res: Response) {
        const data = getAideData();

        if (format === 'json') {
            return res.json(data);
        }

        res.type('html');
        return res.send(getAideHtml(data));
    }
}