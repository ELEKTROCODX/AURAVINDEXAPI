// Import model
import * as loan_model from './loan.model.js';

// Create loan
export const create_loan = async (loan_data) => {
    const new_loan = new loan_model.loan(loan_data);
    return await new_loan.save();
}

// Fetch all
export const find_all_loans = async (skip, limit, sort_field, sort_direction) => {
    return await loan_model.loan.find().sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'book', populate: [{ path: 'authors' }, { path: 'editorial' }, { path: 'book_status'}, { path: 'book_collection'}] },
        { path: 'loan_status' }
    ]);
}

// Fetch with filters
export const filter_loans = async (filter, skip, limit, sort_field, sort_direction) => {
    return await loan_model.loan.find(filter).sort({[sort_field]: sort_direction}).skip(skip).limit(limit).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'book', populate: [{ path: 'authors' }, { path: 'editorial' }, { path: 'book_status'}, { path: 'book_collection'}] },
        { path: 'loan_status' }
    ]);
}

// Count loans
export const count_loans = async () => {
    return await loan_model.loan.countDocuments();
}

// Fetch by ID
export const find_loan_by_id = async (id) => {
    return await loan_model.loan.findById(id).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'book', populate: [{ path: 'authors' }, { path: 'editorial' }, { path: 'book_status'}, { path: 'book_collection'}] },
        { path: 'loan_status' }
    ]) || null;
}

// Fetch by finish and start date
export const find_loan_by_date = async (book_id, user_id, loan_status_id, start_date, finish_date) => {
    // Function to check if loan date catches another loan with book and date, guided by ChatGPT.
    return await loan_model.loan.findOne({
        book: book_id,
        user: user_id,
        loan_status: { $ne: loan_status_id },
        $or: [
            {createdAt: {$lte: start_date}, return_date: {$gte: finish_date}},
            {createdAt: {$lte: start_date}, returned_date: {$gte: finish_date}}
        ]
    }).populate([
        { path: 'user', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'book', populate: [{ path: 'authors' }, { path: 'editorial' }, { path: 'book_status'}, { path: 'book_collection'}] },
        { path: 'loan_status' }
    ]) || null;
}

// Update loan
export const update_loan = async (id, updates) => {
    return await loan_model.loan.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Delete loan
export const delete_loan = async (id) => {
    return await loan_model.loan.findByIdAndDelete(id);
}