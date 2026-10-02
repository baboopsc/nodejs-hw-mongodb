import createHttpError from 'http-errors';
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams, parseSortParams, parseFilterParams } from '../utils/parseParams.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const result = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: result,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    let photo;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        photo = result.secure_url;
    }

    const contact = await createContact({
        ...req.body,
        userId: req.user._id,
        ...(photo && { photo }),
    });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;

    let photo;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        photo = result.secure_url;
    }

    const updatedContact = await updateContact(contactId, req.user._id, {
        ...req.body,
        ...(photo && { photo }),
    });

    if (!updatedContact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
};