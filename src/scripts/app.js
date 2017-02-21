import $ from 'jquery';
import Backbone from 'backbone';

//--------------------------------------------------------------------------
//TASK :  Create form validation based on the criteria asked below.
//        
//        For inputs that don't meet the criteria, you will need 
//        to apply a class of 'MG-bg_fail'
//
//        For inputs that are valid, you will apply a class of 'MG-bg_success'
//--------------------------------------------------------------------------

const FormView = Backbone.View.extend({
	el: '#app-container',
	events: {
		"submit #form-newuser" : "handleFormSubmit",
		"click .btn_reset" : "handleReset"
	},

	_renderFlashMsg: function(flashMsgDomEl, obj){
		// flashMsgDomEl.classList.add('MG-bg_fail')
		if(obj.isValidInput){
			flashMsgDomEl.classList.add('MG-bg_success')
			flashMsgDomEl.classList.remove('MG-bg_fail')
			flashMsgDomEl.innerHTML = 	'&#10003;'			
		} else {
			flashMsgDomEl.classList.add('MG-bg_fail')
			flashMsgDomEl.classList.remove('MG-bg_success')
			flashMsgDomEl.innerHTML = obj.msg
		}


	},
	
	_validateUsernameField: function(formDomEl){
		let usernameInputEl = formDomEl.username
		let userNameInputVal = usernameInputEl.value
		let flashMsgEl = document.querySelector('.field_username .flash-msg')

		if(userNameInputVal.length === 0){
			flashMsgEl.innerHTML = 	'Input needs to be longer than nothing.'
			flashMsgEl.classList.add('MG-bg_fail')
			flashMsgEl.classList.remove('MG-bg_success')

		} else if (userNameInputVal.indexOf(' ') > -1){
			flashMsgEl.innerHTML = 	'No spaces, sorry chipper!'
			flashMsgEl.classList.add('MG-bg_fail')
			flashMsgEl.classList.remove('MG-bg_success')
		} else {
			flashMsgEl.innerHTML = 	'&#10003;'
			flashMsgEl.classList.add('MG-bg_success')
			flashMsgEl.classList.remove('MG-bg_fail')
		}
	},
	
	_validatePasswordField: function(formDomEl){
		let passwordInputEl = formDomEl.password
		let confirmPasswordInputEl = formDomEl.confirmPassword

		let passwordInputValue = passwordInputEl.value
		let confirmPwInputValue = confirmPasswordInputEl.value

		let flashMsgEl = document.querySelector('.field_password .flash-msg')
	
		if(passwordInputValue.length === 0){
			flashMsgEl.innerHTML = 	'Password needs to be longer than nothing; not secure.'
			flashMsgEl.classList.add('MG-bg_fail')
			flashMsgEl.classList.remove('MG-bg_success')
		} else if (confirmPwInputValue !== passwordInputValue){
			flashMsgEl.innerHTML = 	'Your passwords do not match'
			flashMsgEl.classList.add('MG-bg_fail')
			flashMsgEl.classList.remove('MG-bg_success')
		} else {
			flashMsgEl.innerHTML = 	'&#10003;'
			flashMsgEl.classList.add('MG-bg_success')
			flashMsgEl.classList.remove('MG-bg_fail')
		}
	},

	_validateSalaryField: function(formDomEl){
		let salaryInputEl = formDomEl.salary
		let salaryInputValue = salaryInputEl.value

		let flashMsgEl = document.querySelector('.field_salary .flash-msg')

		if( salaryInputValue.length === 0 ){
			this._renderFlashMsg(flashMsgEl, { isValidInput: false, msg: 'pls give a salary input' })
		} else if( isNaN(salaryInputValue) === true){
			this._renderFlashMsg(flashMsgEl, { isValidInput: false, msg: 'input needs to be a number' })		
		} else {
			this._renderFlashMsg(flashMsgEl, { isValidInput: true})
		}
	},
	
	_validateSelectedGenderField: function(formDomEl){
		let flashMsgEl = document.querySelector('.field_gender .flash-msg')
		let genderRadioInputElsArray = [...formDomEl.gender]
		let checkedRadioEl = genderRadioInputElsArray.find(function(radioInputEl){
			return radioInputEl.checked //evaluates to true or false
		})
		if(typeof checkedRadioEl === 'undefined'){
			this._renderFlashMsg(flashMsgEl, { isValidInput: false, msg: 'Pls select a gender!' })		
		} else {
			this._renderFlashMsg(flashMsgEl, { isValidInput: true })		
		}
	},
		
	handleFormSubmit: function(evt){
		evt.preventDefault()
		
		console.log('form submitted!')
		let theRealFormEl = evt.target
		
		this._validateUsernameField(theRealFormEl)
		this._validatePasswordField(theRealFormEl)
		this._validateSalaryField(theRealFormEl)
		this._validateSelectedGenderField(theRealFormEl)


	},
	
	handleReset: function(evt){
		evt.preventDefault();
		console.log('RESET CLICKED');
		let allInputElsNodeList = document.querySelectorAll('#form-newuser input')
		console.log(allInputElsNodeList)
		let allInputElsArray = [...allInputElsNodeList]
		console.log(allInputElsArray)
		allInputElsArray.forEach(function(inputEl){
			if(  inputEl.type === 'checkbox' || inputEl.type === 'radio' ){
				inputEl.checked = false
			} else {
				inputEl.value = ''
			}
		})
	},

	_buildHtmlTemplate:function(){
		let htmlStr = `
		<h2>Form</h2>
		<form class="MG-grid MG-form-group" id="form-newuser">
		`
	   // (1) User name cannot be blank and must contain no spaces
		// ---------------------------------------
		htmlStr += `
			<div class="MG-md-6-of-12 MG-form-group__field field_username ">
				<label>Username</label>
				<input type="text" name="username" placeholder="Username"/>
				<p class="flash-msg"></p>
			</div>
			<div class="MG-sm-12-of-12"><hr/></div>
		`
		// (2) Password should match other password
		// ---------------------------------------
		htmlStr += `
			<div class="MG-md-6-of-12 MG-form-group__field field_password">
				<label>Password</label>
				<input type="password" name="password" placeholder="Password"/>
				<p class="flash-msg"></p>	
			</div>
			<div class="MG-md-6-of-12 MG-form-group__field">
				<label>Confirm Password</label>
				<input type="password" name="confirmPassword" placeholder="Confirm Password"/>
			</div>
			<div class="MG-sm-12-of-12"><hr/></div>

		 `
	   
		// (3) Should be a number (no alphabetic characters)
		// ---------------------------------------
		htmlStr += `
			<div class="MG-md-6-of-12 MG-form-group__field field_salary">
				<label>Targeted Salary</label>
				<input type="text" name="salary" placeholder="Password"/>
				<p class="flash-msg"></p>	
			</div>
		`
		
		// (4) One of the options should be selected
		// ---------------------------------------
		htmlStr += `
			<div class="MG-md-6-of-12 MG-form-group__field field_gender">
				<label>Your Gender</label>
				<label class="gendr" ><input type="radio" name="gender" value="male" class="MG-radio"/> Male</label>
				<label class="gendr" ><input type="radio" name="gender" value="female" class="MG-radio"/> Female</label>
				<label class="gendr" ><input type="radio" name="gender" value="other" class="MG-radio"/> Other</label>
				<p class="flash-msg"></p>	
			</div>
			<div class="MG-sm-12-of-12"><hr/></div>
		`
		
		// (5) Check to see that terms are accepted
		// (6) Clear all values on the form inputs if user clicks the .btn_reset button 
		// ---------------------------------------
		htmlStr += `
			<div class="MG-md-6-of-12 MG-form-group__field">
				<h6><input type="checkbox" name="termsAccepted" class="MG-checkbox"/> I confirm that I agree to the terms outlined above </h6>
				<p class="flash-msg"></p>	
				<button class="MG-btn_primary" type="submit">Submit</button> 
				<button class="MG-btn_sm btn_reset">Reset</button>
			</div>
			
		</form>`
		return htmlStr
	},
	
	render: function(){
		this.el.innerHTML = this._buildHtmlTemplate();
	}
})

let formView = new FormView();
formView.render();