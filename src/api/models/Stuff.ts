import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument, ObjectId } from "mongoose";
import { User } from "../../auth/models/User";


export type CatDocument = HydratedDocument<stuff>;
export type AvisDocument = HydratedDocument<Avis>;

@Schema()
export class stuff extends Document {
    @Prop({ required: true })
    title: string;
    
    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    imageUrl: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true })
    price: number;

    @Prop({ default: Date.now() })
    createdAt?: number;

    @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }], default: [] })
    usersLiked: ObjectId[];

    @Prop({ default: 0 })
    likes: number;
}

export const stuffSchema = SchemaFactory.createForClass(stuff);


@Schema()
export class Avis extends Document {
    @Prop({ type: mongoose.Types.ObjectId, required: true })
    stuffId: ObjectId;

    @Prop({ required: true })
    user: string;

    @Prop({ required: true })
    comment: string;

    @Prop({ default: Date.now() })
    createdAt?: number;
}

export const avisSchema = SchemaFactory.createForClass(Avis);