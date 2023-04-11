const async = require('async');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// set up MongoDB connection
mongoose.connect('mongodb+srv://phungdao:phung123@geolocats.jcedrpx.mongodb.net/LostCat');
// const url = 'https://hawaiianhumane.org/lost-pets/?speciesID=2';
// const url2 = `${id}`
// create a schema and model for the items

const Item = mongoose.model('Item', itemSchema);

// create a queue with concurrency limit of 3
const queue = async.queue((task, callback) => {
  const { url, type } = task;
  console.log(`processing task: ${url}`);

  axios.get(url)
    .then((response) => {
      if (type === 'list') {
				const html = response.data;
        // scrape the list page and enqueue detail page tasks
        const $ = cheerio.load(html);
        const itemIds = [];
        $('article, html').each(async function() {
          const itemId = $(this).data('id');
          itemIds.push(itemId);
          // check if the item is already in MongoDB
          LostCat.findOne({ id: itemId }, (err, existingItem) => {
            if (err) {
              console.error(err);
            } else if (!existingItem) {
              // enqueue a detail page task
              queue.push({ url: `https://hawaiianhumane.org/lost-pets-details/?animalID=${itemId}`, type: 'detail' });
            }
          });
        });
        console.log(`found ${itemIds.length} items on ${url}`);
      } else if (type === 'detail') {
        // scrape the detail page and save to MongoDB
				const html = response.data;
        const $ = cheerio.load(html);
        const id = $('.id-value.value.c-1-2')[0].innerText
        const name = $('p').text();
        const breed = $('img').attr('src');
        // const itemId = url.split('/').pop();
        const age = $('.age-value.value.c-1-2')[0].innerText
				const gender = $('.gender-value.value.c-1-2')[0].innerText
				const ogUrl = `https://hawaiianhumane.org/lost-pets-details/?animalID=${id}`
				const imgUrl = $('#animal-img-1 img').data('src')
				const s3imgUrl = `https://phung-stuff.s3.amazonaws.com/${id}`
// S3 upload
				const imageUrl = imgUrl;
				const bucketName = 'phung-stuff';
				const fileName = `${id}`;
				uploadImageFromUrlToS3(imageUrl, bucketName, fileName);
// S3 upload ends				
				const location = $('.city-state-lost-value.value.c-1-2')[0].innerText
				const lostLocation = $('.location-lost-value.value.c-1-2')[0].innerText
				const catColor = $('.color-value.value.c-1-2')[0].innerText
				const addLostCat = new LostCat({ _id: id, name: name, breed: breed, age: age, gender: gender, ogUrl: ogUrl, imgUrl: imgUrl, s3imgUrl: s3imgUrl, location: location, lostLocation: lostLocation, catColor: catColor });
        addLostCat.save((err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`saved item with id ${addLostCat._id}`);
          }
        });
      }
      callback();
    })
    .catch((err) => {
      console.error(err);
      callback();
    });
}, 3);

// enqueue the list page task
queue.push({ url: 'https://hawaiianhumane.org/lost-pets/?speciesID=2', type: 'list' });




// .then((response) => {
// 			const html = response.data;
// 			const $ = cheerio.load(html);
// 			$('article', html).each(async function() {
// 				let id = $(this).data('id');
// 				let name = $(this).data('name');
// 				let age = $(this).data('agetext');
// 				let gender = $(this).data('gender');
// 				let breed = $(this).data('primarybreed');
// 				let tempLocation = $(this).children('.animal-location.card-footer').children('span.small.text-truncate').text()
// 				let tempImgUrl = $(this).children().data('bg');
// 				let regex = /(?:pet)/g;
// 				let subst = `pets`;
// 				let ogUrl = url.replace(regex, subst);
// 				let regex2 = /url\('/g
// 				let regex3 = /'\)/g
// 				let tempImgUrl2 = tempImgUrl.replace(regex2, '')
// 				let imgUrl = tempImgUrl2.replace(regex3, '')
// 				let locationRegex = /Location: /guis;
// 				let location = tempLocation.replace(locationRegex, '')
// 				let s3imgUrl = `https://phung-stuff.s3.amazonaws.com/${id}`

// 				let doc = await LostCat.findById(id).maxTimeMS(20000).exec((err, result) => {
// 							_id: id,
// 							name: name,
// 							age: age,
// 							gender: gender,
// 							breed: breed,
// 							ogUrl: ogUrl,
// 							imgUrl: imgUrl,
// 							location: location,
// 								})
// 						await newLostCat.save();
