const express = require('express');
const mongoose = require('mongoose');
const FormSubmission = require('./models/FormSubmission');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs')
const bodyParser = require('body-parser');
const mongoPass = process.env['mongoPass']


// Connect to MongoDB
mongoose.connect(`mongodb+srv://pdao:${mongoPass}@atlascluster.9zfnrrz.mongodb.net/Work`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
// Main page
app.get('/', (req, res) => {
	res.sendFile(path.resolve('./public/index.html'))
})
// Thank you / confirmation page
app.get('/confirmation', (req, res) => {
	res.sendFile(path.resolve('./public/confirmation.html'))
})

app.get('/admin', (req, res) => {
	
		res.sendFile(path.resolve('./public/admin.html'))
})



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/submit', async (req, res) => {
	if (Array.isArray(req.body.option2)) {
  var opt2toString = req.body.option2.join(',');
	req.body.option2 = opt2toString
}
	const formData = req.body;
  const timestamp = new Date().toLocaleString()
  const status = 'submitted';
  formData.timestamp = timestamp;
  formData.status = status;
  const Submission = new FormSubmission({
	timeStamp: formData.timestamp,
	status: formData.status,
	locationVal: req.body.location,
	appAccountVal: req.body.applicable,
	accountNameVal: req.body.account,
	ssnTinVal: req.body.ssn,
	dateOfTxnVal: req.body.datetxn,
	dateOfDiscVal: req.body.datediscovered,
	indivResVal: req.body.indivres,
	employeeVal: req.body.employee,
	positionVal: req.body.position,
	chargeOffAmountVal: req.body.chargeoffamount,
	cashingLimitVal: req.body.cashinglimit,
	dropdownOpt1Val: req.body.option1,
	dropdownOpt2Val: req.body.option2,
	dropdownOpt2OtherVal: req.body.option2other,
	dropdownOpt4OtherVal: req.body.option4other,
	dropdownOpt3Val: req.body.option3,
	dropdownOpt4Val: req.body.option4,
	checkInfoMakerVal: req.body.checkinfomaker,
	checkInfoPayeeVal: req.body.checkinfopayee,
	checkInfoDrawnOnVal: req.body.checkinfodrawnon,
	checkInfoOgAmountVal: req.body.checkinfoogamount,
	checkInfoExpensesVal: req.body.checkinfoplusexpenses,
	checkInfoRecoveriesVal: req.body.checkinfolessrecoveries,
	checkInfoNetCoVal: req.body.checkinfonetchargeoff,
	individualComments: req.body.indivcomments,
	supervisorComments: req.body.supervisorcomments,

	
  });

  try {
    await Submission.save();
    res.redirect('/confirmation');
  } catch (err) {
    res.status(400).send(err);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});