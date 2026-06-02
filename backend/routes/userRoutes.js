import express from 'express'
import { register } from '../controller/userController.js';

const router = express.Router();

router.get('/',(req,res)=>{
    res.send({
        status:1,
        message:"Success"
    })
})
router.post('/register', register)

export default router;