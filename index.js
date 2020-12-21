var express = require('express');
//var shortid = require('shortid');
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var flash = require('connect-flash');

//var session = require('express-session')
var app = express();
var controller = require("./controllers/controller-admin");
var controllerCate = require("./controllers/controller-category");
var controllerUser = require("./controllers/controller-home");
var controllerMid = require("./controllers/middleware");
var controllerPro = require("./controllers/controller-product")
var controllerOrder = require("./controllers/controller-order")
var controller_session = require("./controllers/session");
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}))

//body-parser
var bodyParser = require('body-parser');
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(controller_session)
app.use(flash());

app.set("view engine", "ejs");
app.set("views", "./views")
app.listen(3000)

//connect mongoosejs
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://huy:123@cluster0.znvjk.mongodb.net/shop?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if (err){
        console.log("connect fail" + err)
    } else {
        console.log("connect successfull")
    }
});

app.get("/login", controllerMid.aulogined, controller.login);
app.post("/login", controllerMid.aulogined, controller.postlogin);

app.get("/logout/:id", controllerMid.aulogin, controller.logout);

app.get("/dangky", controllerMid.aulogin, controller.dangky);
app.post("/dangky", controllerMid.aulogin, controller.postdangky);

app.get("/user", controllerMid.aulogin, controllerMid.auTypeUser,controller.user);
app.get("/user/delete/:id", controllerMid.aulogin, controllerMid.auTypeUser,controller.deleteuser);
app.get("/user/edit/:id", controllerMid.aulogin, controllerMid.auTypeUser,controller.userEdit);
app.get("/admin/change-pass", controllerMid.aulogin, controller.changePass);
app.post("/admin/change-pass", controllerMid.aulogin, controller.postChangePass);
app.post("/user/edit", controllerMid.aulogin, controller.postUserEdit);

app.get("/admin", controllerMid.aulogin, controller.admin);

app.get("/admin/product/add", controllerMid.aulogin,controllerMid.auTypeUser, controllerPro.addProduct);
app.post("/admin/product/add", controllerMid.aulogin, controllerPro.postAddProduct);
app.get("/admin/product", controllerMid.aulogin, controllerMid.auTypeUser, controllerPro.product);
app.get("/admin/product/edit/:id", controllerMid.aulogin,controllerMid.auTypeUser, controllerPro.proEdit)
app.post("/admin/product/edit",controllerMid.aulogin,controllerPro.postProEdit);
app.get("/admin/product/delete/:id", controllerMid.aulogin, controllerMid.auTypeUser,controllerPro.proDelete)

app.get("/admin/category", controllerMid.aulogin, controllerMid.auTypeUser,controllerCate.category);
app.get("/admin/category/add", controllerMid.aulogin, controllerMid.auTypeUser,controllerCate.cateAdd);
app.post("/admin/category/add", controllerMid.aulogin, controllerCate.postCateAdd);
app.get("/admin/category/edit/:id", controllerMid.aulogin, controllerMid.auTypeUser,controllerCate.cateEdit);
app.post("/admin/category/edit", controllerMid.aulogin, controllerCate.postCateEdit);
app.get("/admin/category/delete/:id", controllerMid.aulogin, controllerMid.auTypeUser,controllerCate.cateDelete);

app.get("/admin/order", controllerMid.aulogin, controllerOrder.order)
app.get("/admin/order/view/:id", controllerMid.aulogin, controllerOrder.vieworder)

app.get("/admin/report", controllerMid.aulogin, controller.report)

app.get("/", controllerUser.home);
app.get("/samsung", controllerUser.samsung);
app.get("/apple", controllerUser.apple);

app.get("/view-cart/:id", controllerUser.viewCart)
app.get("/view-cart/delete/:id", controllerUser.deleteviewCart)
app.get("/view-cart/update/plus/:id", controllerUser.updatePlusViewCart)
app.get("/view-cart/update/min/:id", controllerUser.updateMinViewCart)
app.get("/view-cart/order/:id", controllerUser.order) 
app.post("/view-cart/order", controllerUser.postorder) 
app.get("/cart/:proid", controllerUser.cart);

app.get("/view-cart/order/success/:id", controllerUser.orderSuccess);






