const adminCheckGetStreamersData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    } else if(data.search === undefined || data.search === null || typeof data.search !== 'string') {
        throw new Error('Your entered keyword is invalid.');
    } else if(data.sort === undefined || data.sort === null || typeof data.sort !== 'string' || 
        !['username', 'userCount', 'profit', 'cashouts', 'earnings'].includes(data.sort)) {
        throw new Error('Your entered sort is invalid.');
    }
}

const adminCheckGetStreamerStatsData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.streamerId === undefined || data.streamerId === null || typeof data.streamerId !== 'string') {
        throw new Error('Your entered streamer ID is invalid.');
    }
}

const adminCheckUpdateStreamerStatusData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.streamerId === undefined || data.streamerId === null || typeof data.streamerId !== 'string') {
        throw new Error('Your entered streamer ID is invalid.');
    } else if(data.status === undefined || data.status === null || typeof data.status !== 'boolean') {
        throw new Error('Your entered status is invalid.');
    }
}

module.exports = {
    adminCheckGetStreamersData,
    adminCheckGetStreamerStatsData,
    adminCheckUpdateStreamerStatusData
}; 