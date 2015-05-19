"use strict";
var config    = require('../config'),
		Sequelize = require('sequelize'),
		util;	


util = {
	// 用nodejs的ORM工具操作mysql数据库，这里是一些配置
	sequelize: new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
		host: config.mysql.host,
		port: config.mysql.port,
		dialect: config.mysql.dialect,
		define: {
	    freezeTableName: true,
	    timestamps: false
	  }
	})
}		

  	
module.exports = util;