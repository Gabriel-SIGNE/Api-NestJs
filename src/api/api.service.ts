import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Avis, stuff } from './models/Stuff';
import { Model, ObjectId } from 'mongoose';
import { avisDto, stuffDto } from './models/stuffDto';
import { User } from '../auth/models/User';

@Injectable()
export class ApiService {

    constructor(
        @InjectModel(stuff.name) private readonly stuffModel: Model<stuff>,
        @InjectModel(Avis.name) private readonly avisModel: Model<Avis>,
    ) {}

    // recuperation de tous les objects
    async getAllThing(): Promise<stuff[]> {
        return await this.stuffModel.find();
    }

    // recuperation d'un object
    async getOneThing(thingId: string): Promise<stuff> {
        const thing = await this.stuffModel.findById(thingId);
        if(!thing) {
            throw new NotFoundException('Object does not exist');
        }
        return thing;
    }
    
    // poster des object
    async postThing(thing: stuffDto, user: User): Promise<stuff> {
        // delete thing._id;
        // delete thing.userId;
        const data = Object.assign(thing);
        return await new this.stuffModel(data).save();
    }

    // supprimer un object
    async deleteThing(thingId: string): Promise<stuff> {
        return await this.stuffModel.findByIdAndDelete(thingId);
    }

    // Modification d'un objet
    modifyThing(id: string, thing: stuffDto): Promise<stuff> {
        // delete thing._id;
        return this.stuffModel.findByIdAndUpdate(id, thing, {
            new: true,
            runValidators: true
        });
    }

    async postAvis(avis: avisDto) {
        return new this.avisModel(avis).save();
    }

    async getAvis(stuffId: ObjectId) {
        return (await this.avisModel.find()).filter(avis => avis.stuffId == stuffId);
    }
}
