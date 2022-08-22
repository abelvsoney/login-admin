var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var addUserError=require('../routes/user')
console.log("here 2")

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session.adminLoggedIn);
  if (req.session.adminLoggedIn) {
    productHelpers.getAllProducts().then((users) => {
      console.log(users);
      res.render('admin/view-products', {admin: true,users, adminLoggedIn:req.session.adminLoggedIn});
      req.session.edit=null
    })
    console.log("here admin")
  }else{
    res.redirect('/admin/login');
  }
});

router.get('/login', function(req,res) {
  if(req.session.adminLoggedIn){
    res.redirect('/admin')
  }else{
    res.render('admin/login-admin',{admin:true, loginError:req.session.adminLoginError, adminLoggedIn:req.session.adminLoggedIn})
    req.session.adminLoginError = null
  }
});

const adminCredentials = {
  email:"admin@gmail.com",
  password:"admin"
};
router.post('/login', function(req, res) {
  
  console.log(adminCredentials.email);
  if(req.body.Email == adminCredentials.email && req.body.Password == adminCredentials.password){
    console.log('admin logged in');
    req.session.adminLoggedIn = true;
    req.session.admin = req.body.Email;
    res.redirect('/admin');
    console.log(req.session);
  }else{
    console.log("admin not logged in");
    req.session.adminLoginError="Invalid Username or Password"
    res.redirect('/admin')
  }
});

router.get('/logout', function(req, res) {
  // console.log('logout');
  // console.log('logout',req.session.adminLoggedIn);
  req.session.admin =null
  req.session.adminLoggedIn = null
  req.session.adminLoginError = null
  res.redirect('/admin');
})

router.get('/add-product', function(req,res) {
  if(req.session.admin){
  res.render('admin/add-product', {admin:true, adminLoggedIn:req.session.adminLoggedIn})
  req.session.fromAdmin = true;
  }else{
    res.redirect('/admin')
  }
}); 

router.post('/add-product', function(req,res) {
  // console.log(req.body);
  // res.redirect('/admin');
  
  productHelper.addProduct(req.body,(result) => {
    res.render('admin/add-product',{admin:true, adminLoggedIn:req.session.adminLoggedIn})
  })
});

router.get('/delete-user/', function(req, res) {
  if(req.session.admin){
  let userId=req.query.id
  // console.log(userId);
  productHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin')
  })
  }else{
    res.redirect('/admin')
  }
});

router.get('/edit-user/',async function(req, res) {

  if(req.session.admin){
  let userId=req.query.id;
  let user=await productHelpers.getUserDetails(userId)
  console.log(user);
  res.render('admin/edit-user', {admin:true, user, adminLoggedIn:req.session.adminLoggedIn})
  req.session.edit=true
  }else{
    res.redirect('/admin')
  }
});

router.post('/edit-user', function(req, res){
  if(req.session.admin){
  let userId=req.params.id
  productHelpers.updateUser(userId, req.body).then(() => {
    res.redirect('/admin')
    req.session.edit=null
  })
}else{
  res.redirect('/admin')
}
})

module.exports = router;
