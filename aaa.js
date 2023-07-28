import mongoose from "mongoose";
mongoose.connect("mongodb://0.0.0.0:27017/ack");
import express from "express";
import bodyParser from "body-parser";
import ld from "lodash";
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let path="";
let oops="";
let user="";
let key="123Demo@!";
const item_s= new mongoose.Schema({name:String});
const item= mongoose.model("item",item_s);
const list_s= new mongoose.Schema({head:String,username:String,items:[{ type: item_s }]});
const list= mongoose.model("list",list_s);
const item_d=new item({name:"welcome click + to add items"});

async function begin(){
  let tem=await item.findOne({ name: "welcome click + to add items" });
  if(!tem){
    item_d.save();
  }
}
begin();


app.get("/",(req,res)=>{
  res.render("home",{oops:oops});
  oops="";
});
app.post("/",(req,res)=>{
  user=req.body.username;
  let pass=req.body.passkey;
  if(pass===key){
    path=req.body.name;
  res.redirect("/"+path);
  }
  else{
    oops="No da kanna";
    res.redirect("/");
  }
})

app.get("/:route",(req,res)=>{
  let temp=ld.capitalize(req.params.route);
  async function check(){
    let tem=await list.findOne({ head: temp });
    if(tem){
      res.render("list", {listTitle: tem.head, ListItems: tem.items});
    }else{
      let te= new list({head:temp,username:user,items:[item_d]})
      te.save();
      res.redirect("/"+temp);
    }
  }
  check();
});

app.post("/delete",(req,res)=>{
  const id = req.body.ditem;
  const h=req.body.head;
  async function dee(){
    let a=await list.updateOne({head:h},{$pull:{items:{name:id}}});
  res.redirect("/"+h);
  }
  dee();
});

app.post("/append",(req,res)=>{
  const t = req.body.newItem;
  const th=req.body.head;
  let a=new item({name:t});
  a.save();
  async function append(){
    let tem=await list.findOne({ head: th });
    tem.items.push(a);
    tem.save();
    res.redirect("/"+th);
  }
  append();
});

app.listen(3001, function() {
  console.log("Server started on port 3001");
});
