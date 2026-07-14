const router=require('express').Router();
const {userregister,userlogin,userlogout}=require('../controllers/auth.controller');

router.post('/register',userregister);
router.post('/login',userlogin); 
router.post('/logout',userlogout);

module.exports=router;