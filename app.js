//Importing Dependencies
const { App, LogLevel, subtype } = require('@slack/bolt');
const axios = require('axios');
const dotenv = require('dotenv')
const https = require('https');
const { searchWithEinstein }= require("./einsteinsearch.js")
const {searchResultWithCoveo} = require('./coveosearch.js')
dotenv.config();

var Coveoresults=[];  //Coveo-Search Results

//Creating Slack Bot 
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, 
    appToken: process.env.SLACK_APP_TOKEN 
  });

//Calling Slack Bot App on a port
  (async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
  })();

//Handling app mention events
app.event('app_mention', async ({ event, client, say }) => {
  try {
    //Acknowledging the user mention
    const result = await client.chat.postMessage({
      channel: event.channel,
      text: `Thanks for the mention, <@${event.user}>!`
    });
    //Displaying an input form
    await say(
      {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": " *Welcome. Enter your query below :* "
            }
          },
          {
            "type": "input",
            "dispatch_action" : true,
            "block_id": "input_field",
            "element": {
              "type": "plain_text_input",
              "multiline": true,
              "action_id": "inputaction"
            },
            "label": {
              "type": "plain_text",
              "text": " ",
              "emoji": true
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Search🔎",
                  "emoji": true
                },
                "value": "click_me_123",
                "action_id": "button"
              }
            ]
          }
        ]
      }
    );
  }
  catch (error) {
    console.error(error);
    // Error Page 
    await say(
      {
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": " *Oops! Something went wrong!🚧* "
            }
          }
        ]
     })
    }
});

//Utitlity function to get search-results from Coveo
async function getCoveoResults(enteredText, body, client){

  try{
  
  Coveoresults = await searchResultWithCoveo(enteredText);
  console.log(Coveoresults);

  //Block elements to show the results
  const blockList= [];
 
 
  //Pushing Data into Result Blocklist
  for (const result of Coveoresults){
    blockList.push( {
      "type": "divider"
    });
    blockList.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `<${result.URL}|*${result.title}*>\n ${result.Desc}`
      },
      "accessory": {
        "type": "image",
        "image_url": `${result.ImageURL}`,
        "alt_text": "alt text for image"
      },
      
    });

    blockList.push({
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"emoji": true,
						"text": "Ask Einstein-GPT about this⚡"
					},
					"style": "primary",
          "action_id": "summarize"+result.ID
				}
			]
		});
  }
  //Opening a modal to show Coveo Results
  const rs = await client.views.open({
          trigger_id : body.trigger_id,
           view: {
              type: "modal",
              title: {
                type: "plain_text",
                text: "Coveo-Results"
              },
              close: {
                type: "plain_text",
                text: "Close"
              },
              blocks : blockList
            }
  });

  }catch(error){
    // Error Handling
    console.log("Error happened in getCoveoResults");
  }

}



// Handling the event when search button is clicked
app.action('button', async({body, ack, say, client}) => {
  try{
  //Extracting text in the input field
  const enteredText = body.state.values.input_field.inputaction.value;
  console.log(body.state.values.input_field.inputaction.value);
  await ack();
  //Function to get results
  await getCoveoResults(enteredText, body, client);
  }catch(error){
     //Error Handling
     console.log("Error Occured: ", error);
  }

});

// Function to listen for Slash Command
app.command('/searchwithcoveo', async ({ command, ack, body, client }) => {
  // Acknowledge command request
  await ack();

  await getCoveoResults(command.text, body, client);
});



//Function to listen for summarize button clicked for a particular Coveo Result
app.action(/summarize[0-9]*/, async({body, ack, say, client}) => {

  let loadingBlock =[
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*One second.⏱️  Einstein is thinking..*"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWVzNnB5dzdlMzk5d3o3YWUyNzJxenVrbmlrczF0dTFpOXA3Ym8xNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xswGQr6wBVKAwM/giphy.gif",
				"alt_text": "Einstein Loading."
			}
		}
	];

  // Pushing a Loading page 
  const loading = await client.views.push({
    trigger_id : body.trigger_id,
     view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "EinsteinGPT-Summary"
        },
        close: {
          type: "plain_text",
          text: "Go Back"
        },
        blocks : loadingBlock
   }
  });


  //Getting Result from Einstein-GPT
  var index = parseInt(body.actions[0].action_id.slice(9));
  await ack();
  //Query sent to Einstein-GPT
  const question = `Open the first course in this module link: ${Coveoresults[index].URL} and give a complete summary of the content inside within 200 words`;
 
  console.log(question)
  //Answer received
  var answer = await searchWithEinstein(question);
  answer = answer.substring(answer.indexOf('\n')+1);
  //Blocklist to display answer
  const blockList =  [
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*The Summary*\n ${answer}`
			}
		},
		{
			"type": "divider"
		}
	];
  // Updating the loading page with the content received from Einstein-GPT
  const rs = await client.views.update({
    view_id: loading.view.id,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "EinsteinGPT-Summary"
      },
      close: {
        type: "plain_text",
        text: "Go Back"
      },
      blocks : blockList
    }  
  });

});






























