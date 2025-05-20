// Import model
import * as book_list_model from './book_list.model.js';

// Create book list
export const create_book_list = async (book_list_data) => {
    const new_book_list = new book_list_model.book_list(book_list_data);
    return await new_book_list.save();
}


// Fetch all
export const find_all_book_lists = async (skip, limit) => {
    return await book_list_model.book_list.find().skip(skip).limit(limit)
    .populate([
        { path: 'owner', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'books' },
    ]);
}

// Fetch with filters
export const filter_book_lists = async (filter, skip, limit) => {
    return await book_list_model.book_list.find(filter).skip(skip).limit(limit).populate([
        { path: 'owner', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'books' },
    ]);
}

// Count book lists
export const count_book_lists = async () => {
    return await book_list_model.book_list.countDocuments();
}

// Fetch by ID
export const find_book_list_by_id = async (id) => {
    return await book_list_model.book_list.findById(id).populate([
        { path: 'owner', populate: [{ path: 'gender' }, { path: 'role'} ]},
        { path: 'books' },
    ]) || null;
}

// Update book list
export const update_book_list = async (id, updates) => {
    return await book_list_model.book_list.findByIdAndUpdate(id, updates /* , {new: true, runValidators: true} */);
}

// Add book
export const add_book_to_book_list = async (id, book_id) => {
    return await book_list_model.book_list.findByIdAndUpdate(id, {$addToSet: {books: book_id}});
}

// Remove book
export const remove_book_from_book_list = async (id, book_id) => {
    return await book_list_model.book_list.findByIdAndUpdate(id, {$pull: {books: book_id}});
}

// Delete book list
export const delete_book_list = async (id) => {
    return await book_list_model.book_list.findByIdAndDelete(id);
}