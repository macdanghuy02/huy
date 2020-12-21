
var Customer = require("../model/Customer")
var User = require("../model/User")
var shortid = require('shortid');
var multer = require('multer');
const { db, getMaxListeners, findOne } = require("../model/Product");
const { render } = require("ejs");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imgPro");

module.exports.admin = function (req, res) {
    User.findOne({ _id: req.cookies.loginid }, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("admin-page", { listdata: data,errs: req.flash('message')})
        }
    })

};
module.exports.login = function (req, res) {
    res.render("user/login", { errs: req.flash('message') });
}
module.exports.postlogin = function (req, res) {
    var usernames = req.body.username;
    var password = req.body.password;
    User.findOne({ username: usernames }, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            if (data === null) {
                req.flash('message', 'username sai');
                res.redirect("/login")
                return;
            }
            if (data.password !== password) {
                req.flash('message', 'password sai');
                res.redirect("/login")
                return;
            } 
                if(data.type === "Admin"){
                    res.cookie("userID", "" + shortid.generate(), { singed: true });
                    res.cookie("loginid", "" + data._id, { singed: true });
                    data.save();
                    res.redirect("/admin")
                } else {
                    res.cookie("standedID", "" + shortid.generate(), { singed: true });
                    res.cookie("loginid", "" + data._id, { singed: true });
                    data.save();
                    res.redirect("/admin")
                }
            
        }
    })
};
module.exports.logout = function (req, res) {
    res.cookie('userID', '', { expires: new Date(0) });
    res.cookie('standedID', '', { expires: new Date(0) });
    res.redirect("/login")
}
module.exports.deleteuser = function (req, res) {
    User.findOne({ _id: req.cookies.loginid }, function (err, data) {
        if (err) {
            res.json({ "kq": 1, "errMsg": err });
        } else {
            if (data._id == req.params.id) {
                req.flash('message', 'Tài khoản đang hoạt động không thể xóa');
                res.redirect('/user')
                return;
            } else {
                User.deleteOne({ _id: req.params.id }, function (err) {
                    if (err) {
                        req.flash('message', 'Xóa thất bại');
                        res.redirect('/user')
                        return;
                    } else {
                        req.flash('message', 'Xóa thành công');
                        res.redirect('/user')
                        return;
                    }
                })
            }
        }
    })
}
module.exports.dangky = function (req, res) {
    res.cookie("idUser", "" + shortid.generate(), { singed: true });
    res.render("user/dangky", { id: req.cookies.loginid, errs1: req.flash('message') });
}
module.exports.postdangky = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
        } else if (err) {
            res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
        } else {
            var user = User({
                _id: req.cookies.idUser,
                username: req.body.username,
                password: req.body.password,
                type: req.body.typeuser
            });
            User.findOne({ username: user.username }, function (err, data) {
                if (err) {
                    res.send("username ton tai")
                } else {
                    if (data !== null) {
                        req.flash('message', 'username đã tồn tại');
                        res.redirect('/dangky')
                        return;
                    }
                    if (req.body.username === "" || req.body.password === "") {
                        req.flash('message', 'username và password không được để trống');
                        res.redirect('/dangky')
                        return;
                    }
                    user.save(function (err) {
                        if (err) {
                            req.flash('message', 'Đăng ký không thành công');
                            res.redirect('/dangky')
                            return;
                        } else {
                            req.flash('message', 'Đăng ký thành công');
                            res.redirect('/user')
                            return;
                        }
                    })

                }
            })
        }

    });
};
module.exports.user = function (req, res) {
    User.find(function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
                res.render("user/user", { listuser: data, listdata: req.cookies.loginid, errs: req.flash('message') });

        }
    })
};
module.exports.userEdit = function (req, res) {
    User.findById(req.params.id, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("user/edit", { listuser: data, id: req.cookies.loginid, errs1: req.flash('message') })
        }
    })
}
module.exports.postUserEdit = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
        } else if (err) {
            res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
        } else {
            User.updateOne({ _id: req.body.idUser }, {
                username: req.body.username,
                password: req.body.password,
                type: req.body.typeuser
            }, function (err) {
                if (err) {
                    req.flash('message', 'Chỉnh sửa thất bại');
                    res.redirect('/user/edit/' + req.body.idUser)
                    return;
                } else {
                    req.flash('message', 'chỉnh sửa Thành công');
                    res.redirect('/user')
                    return;
                }
            });
        }
    });
}
module.exports.report = function (req, res) {
    Customer.find(function (err, data) {
        if (err) {
            res.send("" + err)
        } else {
            res.render("report/report", { listdata: data })
        }
    })
}
module.exports.changePass = function (req, res) {
    User.findOne({_id: req.cookies.loginid}, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            res.render("user/change-pass", { listuser: data })
        }
    })
}
module.exports.postChangePass = function (req, res) {
    User.findOne({_id: req.cookies.loginid}, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {
            User.updateOne({ _id: req.body.idUser }, {
                password: req.body.password,
            }, function (err) {
                if (err) {
                    req.flash('message', 'Chỉnh sửa thất bại');
                    res.redirect('/admin' + req.body.idUser)
                    return;
                } else {
                    req.flash('message', 'Change password success');
                    res.redirect('/admin')
                    return;
                }
            })
        }
    })
}