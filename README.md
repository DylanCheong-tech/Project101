# Project101
Cherry Pot Marketing Catalog Website 

## Declaration 
This project is periodically maintained by Cheong Wai Hong (@DylanCheong-tech) and Freddy Agus (@babypom).

## Introduction 
Cherry Pot Marketing is a gardening pot seller in Ipoh, Malaysia. This website is a platform for this company to display all their products to their customers.

## Project structure / Implementations 
### Version 1.0
This website is using basic HTML, CSS, and JavaScript. Also, involves another JS Framework, jQuery, Node.js, and Vue.js(in latter versions).
The web directory is well structured for holding different type of source code file, data files, and image files.
All the product infromation for the pages is stored in JSON data file format. The pages request the json datafiles by using AJAX implementation.

NodeJs and ExpressJs is in used for acting as a simple server for routing and serving the correct pages and datafiles. 

### Version 2.0

This version is coming with some significant changes on the webpages. First, there is two category of the business products will be displaying on the page, Plastic Products and Iron Products. The page starting (as index.html) with the category display and let the use to choose which categore to view. All the main pages and product pages are implemented by using the fundamentals of VueJs framework. 

Persistence data storages: 
- mongodb: storing the metadata of each of the product information
- Google Storage Bucket: storing all the blob product image files

Furthermore, backstage portal is developed for business owner to access and modify the webpage contents freely. The portal page authentication Passport [LocalStrategy](https://www.passportjs.org/packages/passport-local/) middleware. 

## Deployment 
This website project is deployed by using Google Cloud Platform App Engine. 

URL: <https://cherrypot88.com>
