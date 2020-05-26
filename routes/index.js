var express = require('express');
var router = express.Router();
var monk = require('monk');
var db=monk('localhost:27017/ocr');
var collection=db.get('admindetails');
var images=db.get("images")
var multer=require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

router.get('/', function(req, res, next) {
	images.find({},function(err,docs){
    res.render('index');
});
});

/* GET home page. */
router.get('/loginreg', function(req, res) {
  collection.find({},function(err,docs){
    if (err) {
      console.log(err);
    }
    else{
      var s = docs.length
            console.log(docs[s-1])
      res.render('loginreg',{"title": docs});
    }
  })
});

router.get('/table', function(req, res) {
    images.find({},function(err,docs){
       if(err){console.log(err)}
        else {console.log(docs)
             res.render('table',{"data":docs});}
      });
    });

router.post('/upload',upload.single('photo'),function(req,res){
console.log(req.file);
console.log(req.body.rollno);
console.log(req.body.name);
console.log(req.body.validtill);
console.log(req.body.college);
console.log(req.body.department);
console.log(req.body.city);
console.log(req.body.course);
images.findOne({"rollno":req.body.rollno},function(err,docs) {
  // body...
  if (docs) {
          res.render('index',{"exist":"rollno already exist"});
  }
  else{
      images.insert({"image":req.file.originalname,"rollno":req.body.rollno,"name":req.body.name,"validtill":req.body.validtill,"college":req.body.college,"department":req.body.department,"city":req.body.city,"course":req.body.course},function(err,docs){      
      
      res.render('index')
});    
  }
})

});

router.post('/signin', function(req, res) {
 console.log(req.body)
    
    collection.findOne({"username":req.body.username,"password":req.body.password},function(err,docs)
                      {
        if(!docs)
            {
          res.render('index',{"error":"invalid details"});
          }
        else if(docs){
            console.log("login success");
            res.redirect('/table');}
        else
        {console.log(err);}
        });
});

////myyyy////
router.get('/getdata',function(req,res) {
  images.find({},function(err,docs) {
    
    res.send(docs);
  });
});

router.post('/editdata',function(req,res){
  images.update({"_id":req.body._id},{$set:req.body}, function(err,docs){
    console.log(docs)
    res.send(docs)
  })
})
router.post('/delete',function(req,res){
  images.remove({"rollno":req.body.rollno},function(err,docs){
    res.send(docs);
    
  });

})

router.post('/edit', function(req,res){
  console.log(req.body)
  images.find({rollno:req.body.b}, function(err,docs){
    if(docs){
      console.log(docs)
      res.send(docs)
    }
    else{
      console.log(err)
    }
  })
})
router.post('/download', function(req,res){
  console.log(req.body)
  images.find({rollno:req.body.id}, function(err,docs){
    if(docs){
      console.log(docs)
      res.send(docs)
    }
    else{
      console.log(err)
    }
  })
})
router.post('/update', function(req,res){
  console.log(req.body)
  images.update({"_id":req.body.id},{$set:req.body})
  res.redirect('/table');
})

module.exports = router;
