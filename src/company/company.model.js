import { Schema, model } from "mongoose";

const companySchema = Schema(
    {
        name: {
            type: String,
            maxLength: [70, `Can't be overcome 50 characters`],
            required: [true, 'Name is required']
        },
        description: {
            type: String,
            maxLength: [100, `Can't be overcome 50 characters`],
            required: [true, 'Description is required']
        },
        levelOfImpact: {
            type: String,
            maxLength: [45, `Can't be overcome 45 characters`],
            required: [true, 'Level of impact is required']
        },
        yearsOfTrajectory: {
            type: Number,
            required: [true, 'Years of trajectory is required']
        },
        category: {
            type: String,
            maxLength: [40, `Can't be overcome 50 characters`],
            required: [true, 'Business category is required']
        },
        registeredBy: {//No lo pide
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('Company', companySchema)