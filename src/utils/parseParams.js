const ALLOWED_SORT_FIELDS = ['name', 'phoneNumber', 'email', 'contactType', 'createdAt', 'updatedAt'];

export const parsePaginationParams = ({ page = 1, perPage = 10 }) => {
    const parsedPage = parseInt(page, 10);
    const parsedPerPage = parseInt(perPage, 10);
    return {
        page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
        perPage: isNaN(parsedPerPage) || parsedPerPage < 1 ? 10 : parsedPerPage,
    };
};

export const parseSortParams = ({ sortBy = 'name', sortOrder = 'asc' }) => {
    return {
        sortBy: ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'name',
        sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
    };
};

export const parseFilterParams = ({ type, isFavourite }) => {
    const filter = {};
    if (type && ['work', 'home', 'personal'].includes(type)) {
        filter.contactType = type;
    }
    if (isFavourite === 'true') filter.isFavourite = true;
    if (isFavourite === 'false') filter.isFavourite = false;
    return filter;
};