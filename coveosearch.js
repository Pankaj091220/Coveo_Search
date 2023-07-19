//Importing Dependencies
const axios = require('axios');
const dotenv = require('dotenv')
const https = require('https');
dotenv.config();

// Function to get result from Coveo through Coveo SearchAPI only to specific source
async function searchResultWithCoveo(keyword) {
    try {
      
      const apiKey = process.env.COVEO_API_KEY;
      const organizationId = process.env.COVEO_ORG_ID;
      const source = "coveoIntegrationApi2";
  
      const response = await axios.get(`https://platform.cloud.coveo.com/rest/search/v2?access_token=${apiKey}&organizationId=${organizationId}&q=(${encodeURIComponent(keyword)})(@source=${source})`);
     
      const results = response.data.results;
    
      //Extracting only required data from the response
      const articles = [];
      var cnt=0;
   
      for (const result of results) {
       
        const sourceImage="";
     
        const obj = {
          "ID" : cnt,
          "title" : result.raw.course_name,
          "URL" : result.raw.course_url,
          "Desc" : "\n\n"+result.raw.course_description,
          "Source": "Trailhead",
          "ImageURL" : sourceImage
        }
  
        if(obj.Source=='Coveo - Docs'){
          obj.ImageURL='https://imgur.com/pcnbqq1.png'
        }else if (obj.Source=='Coveo - YouTube Playlists') {
          obj.ImageURL='https://imgur.com/gcBoRVg.jpg';
        } else {
          obj.ImageURL='https://miro.medium.com/v2/resize:fit:1400/1*Ovx8J1dGt33fqznAVBmf-w.gif';
        }
  
        articles.push(obj);
        cnt=cnt+1;
       
      }
  
     
      return articles;
  
    
    } catch (error) {

      //Error Handling
      console.error('An error occurred while performing the search:', error.message);

      
    }
}

// Exporting the function
module.exports = {
    searchResultWithCoveo
};

  
  
  
  
  