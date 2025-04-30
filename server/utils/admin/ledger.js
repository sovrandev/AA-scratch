const adminCheckGetLedgerTransactionsData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || data.search === null || typeof data.search !== 'string') {
        throw new Error('Your entered search query is invalid.');
    } else if(data.filters !== undefined && !Array.isArray(data.filters)) {
        throw new Error('Your entered filters are invalid.');
    } else if(data.startDate && isNaN(new Date(data.startDate).getTime())) {
        throw new Error('Your entered start date is invalid.');
    } else if(data.endDate && isNaN(new Date(data.endDate).getTime())) {
        throw new Error('Your entered end date is invalid.');
    }
}

const adminCheckGetLedgerBalancesData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    }
}

module.exports = {
    adminCheckGetLedgerTransactionsData,
    adminCheckGetLedgerBalancesData
} 