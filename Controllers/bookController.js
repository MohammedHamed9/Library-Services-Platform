const Book = require('../models/bookModel');
const handlerFactory=require('./handlerFactory');
//CRUD OPERATIOS
exports.createBook=handlerFactory.createOne(Book);

exports.updateBook=handlerFactory.updateOne(Book);
exports.deleteBook=handlerFactory.deleteOne(Book);

exports.getAllBooks=handlerFactory.getAllDocs(Book);

exports.getABook=handlerFactory.getADoc(Book);

