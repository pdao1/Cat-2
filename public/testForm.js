function testForm() {
	const randomNames = [
		"Liam",
		"Emma",
		"Noah",
		"Olivia",
		"William",
		"Ava",
		"James",
		"Isabella",
		"Oliver",
		"Sophia",
		"Benjamin",
		"Charlotte",
		"Elijah",
		"Mia",
		"Lucas",
		"Amelia",
		"Mason",
		"Harper",
		"Logan",
		"Evelyn",
		"Alexander",
		"Abigail",
		"Ethan",
		"Emily",
		"Jacob",
		"Ella",
		"Michael",
		"Elizabeth",
		"Daniel",
		"Sofia",
		"Matthew",
		"Aria",
		"Carter",
		"Eva",
		"Nolan",
		"Lila",
		"Jaxon",
		"Mila",
		"Archer",
		"Iris",
		"Grayson",
		"Elodie",
		"Beckett",
		"Fiona",
		"Daxton",
		"Aurora",
		"Hudson",
		"Gemma",
		"Leo",
		"Greta",
		"Maddox",
		"Freya",
		"Micah",
		"Lydia",
		"Ezra",
		"Daisy",
		"Sawyer",
		"Esme",
		"Wyatt",
		"Nova",
		"Milo"
	];

	const loremIpsum =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac ut consequat semper viverra nam libero. Elit sed vulputate mi sit amet. Id diam maecenas ultricies mi eget mauris pharetra et. Accumsan sit amet nulla facilisi morbi tempus iaculis urna id. Sagittis nisl rhoncus mattis rhoncus. Dignissim sodales ut eu sem integer vitae justo eget magna. A erat nam at lectus urna duis convallis convallis. Amet cursus sit amet dictum sit amet justo donec. Aliquam ultrices sagittis orci a scelerisque purus. Molestie ac feugiat sed lectus. In ornare quam viverra orci sagittis eu volutpat. Nec feugiat nisl pretium fusce id. Quis eleifend quam adipiscing vitae proin. Enim facilisis gravida neque convallis a. Donec enim diam vulputate ut. Mattis molestie a iaculis at erat. Blandit aliquam etiam erat velit'

	let a = Math.floor(Math.random() * 61)
	let b = Math.floor(Math.random() * 61)
	let c = Math.floor(Math.random() * 61)
	let d = Math.floor(Math.random() * 61)

	const name1 = document.querySelector('#account-name')
	name1.value = randomNames[a] + ' ' + randomNames[b]

	const name2 = document.querySelector('#indiv-res')
	name2.value = randomNames[c] + ' ' + randomNames[d]

	document.querySelector('#check-info-maker').value = randomNames[a] + ' ' + randomNames[c]
	document.querySelector('#check-info-payee').value = randomNames[b] + ' ' + randomNames[d]

	document.querySelector('#date-of-transaction').value = '2022-12-28'
	document.querySelector('#date-discovered').value = '2022-01-28'
	document.querySelector('#check-info-drawn-on').value = 'First Hawaiian Bank'
	document.querySelector('#position').value = 'Bank Teller'

	function generateSixDigits() {
		const randomNumber = Math.floor(Math.random() * 1000000) + 1;
		return randomNumber.toString().padStart(6, "1");

	}
	function generateSixDigitsDollar() {
		const randomNumber = Math.floor(Math.random() * 1000000) + 1;
		return '$' + randomNumber.toString().padStart(6, "1") + ".00";

	}
	function generateSixteenDigits() {
		const randomNumber = Math.floor(Math.random() * 10000000000);
		return randomNumber.toString().padStart(16, "0");
	}

	function generateNineDigits() {
		const randomNumber = Math.floor(Math.random() * 10000);
		return randomNumber.toString().padStart(9, "0");
	}

	document.querySelector('#employee').value = generateSixDigits()
	document.querySelector('#applicable-account').value = generateSixteenDigits()
	document.querySelector('#ssn-tin').value = generateNineDigits()


	$('#check-info-og-amount, #check-info-plus-expenses, #check-info-less-recoveries, #check-info-net-chargeoff, #charge-off-amount, #cashing-limit').select().val(generateSixDigitsDollar)

	$('#indiv-comments, #supervisor-comments').val(loremIpsum)

}