const { response } = require('express');
var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helper');
var marked = require('marked')
var createDomPurify =require('dompurify')
const {JSDOM} =require('jsdom')
var domPurify = createDomPurify(new JSDOM().window)
/* GET users listing. */

router.get('/', (req, res, next) => {
  let user = req.session.user
  if (user) {
    userHelpers.getAllDetails(user).then((data) => {
      res.render('users/user-index', { user, data });
    })

  }
  else {
    res.redirect('/')
  }
})

router.get('/user-index/:date', (req, res) => {
  let user = req.session.user
  if (user) {
    userHelpers.getDay(req.params.date,user).then((data)=>{
      let d=data[0].date
      p=new Date(d)
      let k=p.toDateString()
      console.log(k+" "+p)
      let html=domPurify.sanitize(marked.parse(data[0].content))
      res.render('users/user-day',{k,user,html})
    })
  }
  else {
    res.redirect('/')
  }
})
router.post('/search',(req,res)=>{
  let user = req.session.user
  let search = req.body.search
  
  console.log(search)
  if (user) {
    userHelpers.getSearch(search,user).then((result)=>{
      res.render('users/search',{user,result,search})
    })
  }
  else{
res.redirect('/')
  }
})



router.get('/add-journal', (req, res) => {
  let user = req.session.user
  if (user) {
    let user = req.session.user
    
    res.render('users/add-journal', { user })
  }
  else {
    res.redirect('/')
  }
})
router.post('/add-journal', (req, res) => {
  let user = req.session.user
  if (user) {

    let date=new Date(req.body.date)
    let data= date.toDateString()
    console.log(data)
    userHelpers.addDetails(user._id, req.body).then(() => {
      res.redirect('/user')

    })
  }
  else {
    res.redirect('/')
  }
})
module.exports = router;
