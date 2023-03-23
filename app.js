/// ######### INTIAL CODE ###########

// const { urlencoded } = require('body-parser');
// const { log } = require('console');
// const express = require('express')
// const { url } = require('inspector');
// const { dirname } = require('path');
// const {day} = require('./date')
// //let ejs = require('ejs');


// const app = express()
// app.set('view engine', 'ejs'); 

// app.use(express.urlencoded({extended:false}));

// app.use(express.static('public'))

// const items = [];
// const workitems = [];


// app.get('/' , function (req, res) {

//     res.render('list',{kindofday:day ,newlistitems :items})

// })


// app.post('/' ,function (req , res) {
//     //console.log(req.body);
//     const item = req.body.newitem;
//     if(req.body.button === 'Work'){
//         workitems.push(item);
//         res.redirect('/work')
//     }else{
//         items.push(item)
//         res.redirect('/')
//     }


// })

// app.get('/work' , function (req , res) {
//     res.render('list', {kindofday:"Work Day" ,newlistitems : workitems})
// })

// app.listen(3000 , function () {
//     console.log('server is listining at port 3000');
// })









//// ########### UPDATED CODE ########## 

const { urlencoded } = require('body-parser');
const { log } = require('console');
const express = require('express')
const { url } = require('inspector');
const { dirname, resolve } = require('path');
const { day } = require('./date')
const mongoose = require('mongoose');
var favicon = require('serve-favicon')
var path = require('path')
var _ = require('lodash');
//let ejs = require('ejs');


const app = express()
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))

// For Using Favicon 

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

/// MONGO DB SERVER
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://admin-jatin:DOSD1TtSqN2IOZTI@cluster0.tual3px.mongodb.net/todolistDB');
}


const listschema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', listschema);

const item1 = new Item({
    name: 'Welcome to the To Do List'
});

const item2 = new Item({
    name: 'To Add the Item hit + Sign'
});

const item3 = new Item({
    name: 'To Delete the Item Click the Checkbox'
});

const defaultItems = [item1, item2, item3]

app.get('/', function (req, res) {

    Item.find({}).then(foundItems => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems).then(resolve => {
                console.log('defaults items saved in the in the todolistDB');
            }).catch(error => {
                console.log(error);
            });
            res.redirect('/');

        } else {
            res.render('list', { newlistitems: foundItems, list_name: "Today" })

        }
    }).catch(error => {
        console.log(error);
    })

})


const listSchema = new mongoose.Schema({
    name: String,
    listitems: [listschema]

})

const List = mongoose.model('List', listSchema)



app.get('/:userId', (req, res) => {
    const customlistname = _.capitalize(req.params.userId);
    console.log(customlistname);

    List.findOne({ name: customlistname }).then(foundlist => {
        console.log(foundlist);
        if (!foundlist) {
            const list = new List({
                name: customlistname,
                listitems: defaultItems
            })
            list.save()
            res.redirect('/'+customlistname)
        } else {
            res.render('list', { newlistitems: foundlist.listitems, list_name: foundlist.name })

        }

    }).catch(err => {
        console.log(err);
    })

})



app.post('/', function (req, res) {
    const newitem = req.body.newitem;
    const listname = req.body.button

    const item = new Item({
        name: newitem
    })

    if(listname === 'Today'){  
        item.save();
        res.redirect('/');
    }else{
        List.findOne({name:listname}).then(foundlist=>{
            foundlist.listitems.push(item);
            foundlist.save();
            res.redirect('/'+listname)
        }).catch(err=>{
            console.log(err);
        })

    }

    
})


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox
    const listname = req.body.listname

    if(listname === "Today"){
        Item.findByIdAndRemove(checkedItemId).then(resolve => {
            console.log("Sucessfully deleted the checked Item");
    
        }).catch(error => {
            console.log(error);
        })
        res.redirect('/');
    }else{
        List.findOneAndUpdate({name:listname},{ $pull: {listitems: {_id :checkedItemId} }}).then(foundlist=>{
            res.redirect('/'+listname);
        }).catch(err=>{
            console.log(err);
        })
    }
  
})


const PORT = process.env.PORT || 3000;

app.listen(3000, function () {
    console.log('server is listining at port 3000');
})



// https://tiny-rose-angelfish-wig.cyclic.app/       link for this app 