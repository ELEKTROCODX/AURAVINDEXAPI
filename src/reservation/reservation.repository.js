// Import model
import * as reservation_model from './reservation.model.js';

// Create reservation
export const create_reservation = async (reservation_data) => {
    const new_reservation = new reservation_model.reservation(reservation_data);
    return await new_reservation.save();
}

// Fetch all
export const find_all_reservations = async (skip, limit) => {
    return await reservation_model.reservation.find().skip(skip).limit(limit).populate('user room');
}

// Fetch with filters
export const filter_reservations = async (filter, skip, limit) => {
    return await reservation_model.reservation.find(filter).skip(skip).limit(limit).populate('user room');
}

// Count reservations
export const count_reservations = async () => {
    return await reservation_model.reservation.countDocuments();
}

// Fetch by ID
export const find_reservation_by_id = async (id) => {
    return await reservation_model.reservation.findById(id).populate('user room') || null;
}

// Fetch by finish and start date
export const find_reservation_by_date = async (room_id, start_date, finish_date) => {
    // Function to check if reservation date catches another reservation with same room and date, guided by ChatGPT.
    return await reservation_model.reservation.findOne({
        room: room_id,
        $or: [
            { start_date: { $lt: finish_date }, finish_date: { $gt: start_date } },
            { start_date: { $gte: start_date, $lte: finish_date } },
            { finish_date: { $gte: start_date, $lte: finish_date } }
        ]
    }).populate('user room') || null;
}

// Update reservation
export const update_reservation = async (id, updates) => {
    return await reservation_model.reservation.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete reservation
export const delete_reservation = async (id) => {
    return await reservation_model.reservation.findByIdAndDelete(id);
}