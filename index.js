const express = require('express');
const mongoose = require('mongoose');
const LostCat = require('./models/LostCat');
const path = require('path');
const async = require('async');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;
const fs = require('fs')
const bodyParser = require('body-parser');
const mongoPass = process.env['mongoPass']
const mongoFHB = process.env['mongoFHB']
const AWS = require('aws-sdk');

const accessKeyId = process.env['accessKeyId']
const secretAccessKey = process.env['secretAccessKey']

const s3 = new AWS.S3({
	accessKeyId: accessKeyId,
	secretAccessKey: secretAccessKey,
});

const namesArray = []

const uploadImageFromUrlToS3 = async (imageUrl, bucketName, fileName) => {
	try {
		const response = await axios.get(imageUrl, {
			responseType: 'arraybuffer'
		});
		const buffer = Buffer.from(response.data, 'binary');

		const params = {
			Bucket: bucketName,
			Key: fileName,
			Body: buffer,
			ACL: 'public-read',
			ContentType: response.headers['content-type']
		};

		const data = await s3.upload(params).promise();
		console.log(`Successfully uploaded image to S3: ${data.Location}`);
	} catch (error) {
		console.error(`Failed to upload image to S3: ${error}`);
	}
};


// mongoose.connect(`mongodb+srv://phungdao:phung123@geolocats.jcedrpx.mongodb.net/LostCat`, {

// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });

// Routes

// Main page
app.get('/', (req, res) => {
	res.sendFile(path.resolve('./public/index.html'))
})
// Thank you / confirmation page
app.get('/confirmation', (req, res) => {
	res.sendFile(path.resolve('./public/confirmation.html'))
})
// Admin portal
app.get('/map', (req, res) => {
	res.sendFile(path.resolve('./public/map.html'))
})



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Save for user-submitted lost cats

// // Form Submission Route
// app.post('/submit', async (req, res) => {
// 	if (Array.isArray(req.body.option2)) {
// 		var opt2toString = req.body.option2.join(',');
// 		req.body.option2 = opt2toString
// 	}
// 	const formData = req.body;
// 	const timestamp = new Date().toLocaleString()
// 	const status = 'submitted';
// 	formData.timestamp = timestamp;
// 	formData.status = status;

// 	const addLostCat = new LostCat({
// 		

// 	});

// 	try {
// 		await addLostCat.save();
// 		res.redirect('/confirmation');
// 	} catch (err) {
// 		res.status(400).send(err);
// 	}
// });


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});


// Save to fil



// Read it back



mongoose.connect('mongodb+srv://phungdao:phung123@geolocats.jcedrpx.mongodb.net/LostCat');
// const url = 'https://hawaiianhumane.org/lost-pets/?speciesID=2';
// const url2 = `${id}`
// create a schema and model for the items
var itemIds = new Array()

async function createNewLostCat(newLostCat) {
	try {
		const result = await LostCat.create(newLostCat);
		console.log('New document created:', result);
	} catch (error) {
		console.error(error);
	}
}

async function updateCatDetails(id, update) {
	try {
		const result = await LostCat.findByIdAndUpdate(id, update, { new: false });
		console.log('Document updated:', result);
	} catch (error) {
		console.error(error);
	}
}

fs.readFile('resultArr.txt', 'utf8', function(err, data) {
	if (err) throw err;
	const readArray = data.split(',');
	readArray.forEach(function(item) {
		console.log(item)
	})
	console.log(itemIds);
});

async function findDocumentsWithNullField(fieldName) {
	var resultArr = []
	try {
		const query = { [fieldName]: null };
		const result = await LostCat.find(query).select('_id');
		console.log('Documents found:', result);
		for (key in result) {
			resultArr.push(result[key]["_id"])
		}
		// queue begins
		const q = async.queue((item, callback) => {
			console.log(`working on ${item}`);
			let lostLocation, catColor;
			// do something
			url = `https://hawaiianhumane.org/lost-pets-details/?animalID=${item}`
			console.log(url)
			axios.get(url)
				.then((response) => {
					const html = response.data;
					const $ = cheerio.load(html);
					$('article').each(async function() {
						 lostLocation = $('span.location-lost-value.value.c-1-2').text()
						 catColor = $('span.color-value.value.c-1-2').text()
					})
								console.log(lostLocation, catColor)

				}).catch((err) => {
					console.error(err);
				})
			setTimeout(callback, 15000);
		}, 1);
			// do something ends
		
		
		resultArr.forEach((item) => {
			q.push(item);
		});

		q.drain(() => {
			console.log('All items have been processed');
		});
		// queue ends

	} catch (error) {
		console.error(error);
	}
}
// const ids = [1, 2, 3, 4, 5];
// // Initialize the queue with concurrency of 1
// const queue = async.queue(function (task, callback) {
//   // do something with the task
//   console.log(`Processing task ${task}`);
// 	console.log(id)


// // Function to queue items with a delay
// function queueItemsWithDelay(ids, delay) {
//   ids.forEach((id, index) => {
//     setTimeout(() => {
//       queue.push(id);
//     }, index * delay);
//   });
// }

// 	fs.writeFile('resultArr.txt', resultArr.join(','), function(err) {
// if (err) throw err;
// console.log('Array saved to file!');
// });


let fieldName = 'catColor'
findDocumentsWithNullField(fieldName)


async function checkPetIds() {
	var url = 'https://hawaiianhumane.org/lost-pets/?speciesID=2'
	axios.get(url)
		.then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);
			$('article').each(async function() {
				let id = $(this).data('id');
				let name = $(this).data('name');
				let age = $(this).data('agetext');
				let gender = $(this).data('gender');
				let breed = $(this).data('primarybreed');
				let tempLocation = $(this).children('.animal-location.card-footer').children('span.small.text-truncate').text()
				let tempImgUrl = $(this).children().data('bg');
				let regex = /(?:pet)/g;
				let subst = `pets`;
				let ogUrl = url.replace(regex, subst);
				let regex2 = /url\('/g
				let regex3 = /'\)/g
				let tempImgUrl2 = tempImgUrl.replace(regex2, '')
				let imgUrl = tempImgUrl2.replace(regex3, '')
				let locationRegex = /Location: /guis;
				let location = tempLocation.replace(locationRegex, '')
				let s3imgUrl = `https://phung-stuff.s3.amazonaws.com/${id}`
				let catID = await LostCat.findById(id).exec()
				if (catID == null) {
					console.log(id)
					let newLostCat = {
						_id: id,
						name: name,
						age: age,
						gender: gender,
						breed: breed,
						ogUrl: ogUrl,
						imgUrl: imgUrl,
						location: location,
						s3imgUrl: s3imgUrl,
					};
					createNewLostCat(newLostCat)
				}
			})

		})
		.catch((err) => {
			console.error(err);
		})
}



// findDocumentsWithNullField(fieldName)
// console.log(id);		

// 		let id = catID._id
// 		console.log(id)
// console.log(catNull)


// var url = `https://hawaiianhumane.org/lost-pets-details/?animalID=${id}`
// axios.get(url)
// 	.then((response) => {
// 		const html = response.data;
// 		const $ = cheerio.load(html);
// 		$('article').each(async function() {
// 			let lostLocation = $('span.location-lost-value.value.c-1-2').text()
// 			let	catColor = $('span.color-value.value.c-1-2').text()

// 			let update = {
// 			lostLocation: lostLocation,
// 			catColor: catColor,
// 			};
// 			updateCatDetails(id, update)
// 				}
// })

// })
// .catch((err) => {
// 	console.error(err);
// })
// } 




function clog() {
	console.log(itemIds)
}



// async function petDetails(){
// 	itemIds.forEach(function getPetDetails(item){
// 		var url = `https://hawaiianhumane.org/lost-pets-details/?animalID=${item}`
// 		axios.get(url)
// 		.then((response) => {
// 			const html = response.data;
// 			const $ = cheerio.load(html);
// 			$('article').each(async function() {
// 			let id = item
// 			let name = $(this).children('h1')
// 			let age = $(this).children('.age-value.value.c-1-2')
// 			console.log(id, name, age)
// 		})
// 	})		
// 			setTimeout(getPetDetails, 5000)
// })


// }

// async function petDetails(itemIds) {
//   console.log('Starting petDetails function');

//   const queue = async.queue(async function (item) {
//     try {
//       const url = `https://hawaiianhumane.org/lost-pets-details/?animalID=${item}`;
//       const response = await axios.get(url);
//       const html = response.data;
//       const $ = cheerio.load(html);
//       $('article').each(async function () {
//         const id = item;
//         const name = $(this).children('h1');
//         const age = $(this).children('.age-value.value.c-1-2');
//         console.log(id, name, age);
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }, 1);

//   itemIds.forEach((item) => {
//     queue.push(item);
//   });

//   // pause the queue initially
//   queue.pause();

//   // start processing items every 5 seconds
//   let index = 0;
//   const intervalId = setInterval(() => {
//     console.log(`Processing item ${index + 1} of ${itemIds.length}`);
//     if (index >= itemIds.length) {
//       clearInterval(intervalId);
//       return;
//     }
//     queue.resume();
//     index += 1;
//     setTimeout(() => {
//       queue.pause();
//       console.log('Pausing queue');
//     }, 5000);
//   }, 5000);

//   await queue.drain();
//   console.log('Finished petDetails function');
// }
// petDetails(itemIds)
// function log() {
// 	for (let i = 0; i < itemIds.length; i++) {
// 		let x = itemIds[i]
// 		let url2 = `https://hawaiianhumane.org/lost-pets-details/?animalID=${x}`
// 		axios.get(url2)
// 			.then((response) => {
// 				html = response.data;
// 				$ = cheerio.load(html);
// 				$('article').each(async function() {
// 					let id = url.split('=').pop()
// 					let name = $(this).children('h1')
// 					let breed = $('.animal-primary-breed')[0].innerHTML
// 					// const itemId = url.split('/').pop();
// 					let age = $('.age-value.value.c-1-2')[0].innerText
// 					let gender = $('.gender-value.value.c-1-2')[0].innerText
// 					let ogUrl = `https://hawaiianhumane.org/lost-pets-details/?animalID=${x}`
// 					let imgUrl = $('#animal-img-1 img').data('src')
// 					let s3imgUrl = `https://phung-stuff.s3.amazonaws.com/${x}`
// 					// S3 upload
// 					let imageUrl = imgUrl;
// 					bucketName = 'phung-stuff';
// 					fileName = `${x}`
// 					uploadImageFromUrlToS3(imageUrl, bucketName, fileName);
// 					// S3 upload ends				
// 					let location = $('.city-state-lost-value.value.c-1-2')[0].innerText
// 					let lostLocation = $('.location-lost-value.value.c-1-2')[0].innerText
// 					let catColor = $('.color-value.value.c-1-2')[0].innerText

// 					console.log(id, name, breed, location)
// 					LostCat.findByIdAndUpdate(id, { name: name, breed: breed, age: age, gender: gender, ogUrl: ogUrl, imgUrl: imgUrl, s3imgUrl: s3imgUrl, location: location, lostLocation: lostLocation, catColor: catColor })
// 					// let addLostCat = new LostCat({ _id: id, name: name, breed: breed, age: age, gender: gender, ogUrl: ogUrl, imgUrl: imgUrl, s3imgUrl: s3imgUrl, location: location, lostLocation: lostLocation, catColor: catColor });
// 					// // addLostCat.save()
// 					// console.log(id, name, gender, addLostCat)
// 					// .then(() => {
// 					// 		console.log(`saved item with id ${itemId}`);
// 					// 	})
// 					// 	.catch((err) => {
// 					// 		console.error(err);
// 					// 	});
// 				})
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 			});
// 	}

// 	console.log(itemIds)
// }
// setTimeout(log, 10000)


// enqueue the list page task
// queue.push({ url: 'https://hawaiianhumane.org/lost-pets/?speciesID=2', type: 'list' })

