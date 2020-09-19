'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }
    mysql: {
        enable: true,
        package: 'egg-mysql'
    },
    cors: {
        enable: true,
        package: 'egg-cors'
    },
    // assets:{
    //     enable: true,
    //     package: 'egg-view-assets',
    //     autoPort:'8888'
    // }
};
