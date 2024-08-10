const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    // these are bydefault names 
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret:  process.env.CLOUD_API_SECERET
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'TEJ_DEV',
      allowedFormats: async (req, file) => ['png',"jpg","jped"] ,// supports promises as well
     },
  });

module.exports = {
    cloudinary,
    storage
}