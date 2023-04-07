const mongoose = require('mongoose')

const FormSubmissionSchema = new mongoose.Schema({
	timeStamp: { type: String, required: false },
	status: { type: String, required: false },
	locationVal: { type: String, required: false },
	appAccountVal: { type: String, required: false },
	accountNameVal: { type: String, required: false },
	dateOfTxnVal: { type: String, required: false },
	dateOfDiscVal: { type: String, required: false },
	indivResVal: { type: String, required: false },
	employeeVal: { type: String, required: false },
	positionVal: { type: String, required: false },
	chargeOffAmountVal: { type: String, required: false },
	cashingLimitVal: { type: String, required: false },
	dropdownOpt1Val: { type: String, required: false },
	dropdownOpt2Val: { type: String, required: false },
	dropdownOpt2OtherVal: { type: String, required: false },
	dropdownOpt4OtherVal: { type: String, required: false },
	dropdownOpt3Val: { type: String, required: false },
	dropdownOpt4Val: { type: String, required: false },
	checkInfoMakerVal: { type: String, required: false },
	checkInfoPayeeVal: { type: String, required: false },
	checkInfoDrawnOnVal: { type: String, required: false },
	checkInfoOgAmountVal: { type: String, required: false },
	checkInfoExpensesVal: { type: String, required: false },
	checkInfoRecoveriesVal: { type: String, required: false },
	checkInfoNetCoVal: { type: String, required: false },
	individualComments: { type: String, required: false },
	supervisorComments: { type: String, required: false }
});

module.exports = mongoose.model('FormSubmission', FormSubmissionSchema);
