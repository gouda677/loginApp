const express = require('express');//whats express?

const router = express.Router();




const { register, login, logout, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me); // Protected — must be logged in

module.exports = router;

const returnSth = (args) => {
    if (typeof args == 'object') {
        return args;
    }
    return null;
};  
function myFunction(args){
    return args;
}
    
app.post('testpointer',(req,res)=> {
    console.log(req.body);
    res.json({ message: 'Test pointer received' });
});
let localizeData = [1,2,3,4,5];
localizeData.append(6);
localizeData.push(7);
localizeData.map(item => item.name);    
//new 12347298 to branch 1

///addd linie 1
localizeData.forEach(item => {
    console.log(item);
}   );

app.post('/localize',(req,res)=>{
    console.log(req.body);
  //res.send does not send json data, it sends a string response. If you want to send json data, use res.json() instead.

    res.json({ message: 'Localization data received' });//
});