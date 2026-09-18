import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Avis, stuff } from './models/Stuff';
import { Model, ObjectId } from 'mongoose';
import { avisDto, StuffDto } from './models/stuffDto';
import { User } from '../auth/models/User';

@Injectable()
export class ApiService {

    constructor(
        @InjectModel(stuff.name) private readonly stuffModel: Model<stuff>,
        @InjectModel(Avis.name) private readonly avisModel: Model<Avis>
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
    async postThing(thing: StuffDto, id: User): Promise<stuff> {
        const data = Object.assign(thing);
        return await new this.stuffModel({
            ...data,
            userId: id
        }).save();
    }

    // supprimer un object
    async deleteThing(thingId: string, id: string): Promise<stuff> {
        const stuff = await this.getOneThing(thingId);
        if (stuff.userId.toString() !== id) {
            throw new ForbiddenException('Vous n\'avez pas le droit de supprimer cette object!');
        }
        return await this.stuffModel.findByIdAndDelete(thingId);
    }

    // Modification d'un objet
    async modifyThing(id: string, thing: StuffDto, idUser: string): Promise<stuff> {
        const stuff = await this.getOneThing(id);
        if (stuff.userId.toString() !== idUser) {
            throw new ForbiddenException('Vous n\'avez pas le droit de modifier cette object!');
        }
        return this.stuffModel.findByIdAndUpdate(id, thing, {
            new: true,
            runValidators: true
        });
    }

    // Like / unlike un objet (toggle)
    async likeThing(thingId: string, userId: string): Promise<stuff> {
        const thing = await this.getOneThing(thingId);

        const alreadyLiked = thing.usersLiked.some(
            (likedUserId) => likedUserId.toString() === userId
        );

        if (alreadyLiked) {
            // l'utilisateur a déjà liké -> on retire le like (unlike)
            await this.stuffModel.findByIdAndUpdate(thingId, {
                $pull: { usersLiked: userId },
                $inc: { likes: -1 }
            });
        } else {
            // l'utilisateur n'a pas encore liké -> on ajoute le like
            await this.stuffModel.findByIdAndUpdate(thingId, {
                $push: { usersLiked: userId },
                $inc: { likes: 1 }
            });
        }

        return this.getOneThing(thingId);
    }

    async postAvis(avis: avisDto) {
        return new this.avisModel(avis).save();
    }

    async getAvis(stuffId: ObjectId) {
        return (await this.avisModel.find()).filter(avis => avis.stuffId == stuffId);
    }
}