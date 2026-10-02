import { Contact } from '../db/models/contact.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter, userId }) => {
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const [contacts, totalItems] = await Promise.all([
        Contact.find({ ...filter, userId })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(perPage),
        Contact.countDocuments({ ...filter, userId }),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
};

export const getContactById = async (contactId, userId) => {
    return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
    return Contact.create(payload);
};

export const updateContact = async (contactId, userId, payload) => {
    return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, { new: true });
};

export const deleteContact = async (contactId, userId) => {
    return Contact.findOneAndDelete({ _id: contactId, userId });
};