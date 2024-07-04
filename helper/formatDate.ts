export const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        // timeZoneName: 'short',
    };
    const formattedDate: string = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
};

export const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const formattedDate: string = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
};
