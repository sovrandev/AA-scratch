module.exports = (io) => {
    require('./general')(io);
    require('./unbox')(io);
    require('./battles')(io);
    require('./upgrader')(io);
    require('./cashier')(io);
    require('./admin')(io);
    require('./mines')(io);
};
