//  Import scheme from mongoose
import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';

// Create schema
const user_schema = new Schema({
    // ID
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: false
    },
    gender: {
        type: Schema.Types.ObjectId,
        ref: 'gender',
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    user_img: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role',
        required: false,
        // Add default for later
    },
    fcm_token: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }

}, {timestamps : true});

user_schema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

user_schema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if(update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    next();
});

user_schema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        delete ret.fcm_token;
        return ret;
    }
});

// Create model
const user = model('user', user_schema);

// Export model
export {user};