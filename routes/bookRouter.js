const express=require('express');
const router = express.Router();
const bookController=require('../Controllers/bookController');
const authController=require('../Controllers/authController')

router.post('/create',authController.protected,authController.resrectedTo('admin'),
bookController.createBook);
router.put('/update/:id',authController.protected,authController.resrectedTo('admin'),bookController.updateBook);
router.delete('/delete/:id' ,authController.protected,authController.resrectedTo('admin'),bookController.deleteBook)
router.get('/getall',authController.protected,bookController.getAllBooks);
router.get('/getabook/:id' ,authController.protected,bookController.getABook);
module.exports = router;
