var models =  require('../models/models.js');
var sequelize = require('sequelize');

// GET /quizes/statistics
exports.statistics = function(req, res, next) {
	
	var dataStatis = {numberAnswers:0, numberComments:0, averageComments:0, numberPregSinCom:0, numberPregConCom:0};
	
	 sequelize.Promise.all([
		models.Quiz.count(),
		models.Comment.count(),
		models.Comment.aggregate('QuizId','count', { distinct: true })
	 ]).then( function(valores){
		dataStatis.numberAnswers = valores[0];
		dataStatis.numberComments = valores[1];
		dataStatis.averageComments = (dataStatis.numberComments / dataStatis.numberAnswers).toFixed(2);
		dataStatis.numberPregSinCom = dataStatis.numberAnswers - valores[2];
		dataStatis.numberPregConCom = valores[2];
		res.render('statistics/show.ejs', {dataStatis:dataStatis, errors: []});
	  }).catch( function(error){
		next(error);
	  }).finally( function(){
		next();
	  });
};