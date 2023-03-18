const path = require('path');
const fs=require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const app = express();


const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./util/database');

const User=require('./models/user');
const Expense=require('./models/Expense');

const Forgotpassword = require('./models/forgotpassword');
const downloadFile=require('./models/downloadFile');
const Order=require('./models/orders');

var cors = require('cors');
app.use(cors());

// app.set('view engine', 'ejs');
// app.set('views', 'views');
const downloadroutes=require('./routes/user')
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const loginRoutes=require('./routes/user')
const premiumFeature=require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')
const purchaseRoutes=require('./routes/purchase')

const accessLogStream=fs.createWriteStream(
   path.join(__dirname,'access.log'),
   {flags:'a'}
   );

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/user',loginRoutes)
app.use('/user',userRoutes);
app.use('/user',downloadroutes)
app.use('/purchase',purchaseRoutes);
app.use(premiumFeature);
app.use(expenseRoutes);
app.use('/password', resetPasswordRoutes);

app.use((req,res)=>{
console.log("Url",req.url);
res.sendFile(path.join(__dirname,`/public${req.url}`));
})


User.hasMany(Expense);
Expense.belongsTo(User);

 User.hasMany(Order);
 Order.belongsTo(User);
   
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
 
sequelize 
 .sync({alter:true})
 .then(result => {
    //console.log(result);
    app.listen(2000);
 })
 .catch(err => {
    console.log(err);
 }) 