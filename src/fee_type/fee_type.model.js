//  Import scheme from mongoose
import {Schema, SchemaType, model} from 'mongoose';

// Create schema
const fee_type_schema = new Schema({
    // ID
    fee_code: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    cost: {
        type: Schema.Types.Decimal128,
        required: true
    }
}, {timestamps : true});


// Create model
const fee_type = model('fee_type', fee_type_schema);

// Export model
export {fee_type};