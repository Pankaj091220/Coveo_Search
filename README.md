Hi. This is a Slack App integration of Coveo Search 👋


> This is a codebase to bring the Coveo search feature within slack. Both Coveo and Einstein-GPT is integrated for the purpose. For more details, See the Demo Video.


### 🎥 Check out our [demo video](https://drive.google.com/file/d/19IEiDhgPsrZU2Ht6lLmCy23sdYARgZoy/view?usp=sharing)
---
### 🖥️ Also Check out our [presentation](https://docs.google.com/presentation/d/182iwYKN88C5gUJ7jWEpEpxEmUBsjwNcFRH9wk__f-QQ/edit?usp=sharing)
---
## Abstract

- The objective of this project is to create a Slack Bot App within Slack which can help an enterprise to make a search over a database through Coveo.


- It implements **technologies such as OpenAI in Einstein-GPT, Coveo Search API, Salesforce Data Cloud, Bolt.js etc.** to offer user searching over the resources that they want. The system is built to **boost productivity and save time** as it efficiently renders the relevant articles as search results through Coveo, being in Slack itself. Further, simplification of results are done by providing summaries from Einstein-GPT.


- It very efficiently improves the **retention time** in a conversation in slack. 

---
## Tech Stack

### Programming Language

- [**Bolt.js**](): A popular, high-level programming language known for its simplicity, readability, and versatility. It is helpful in Slack App Development.

- [**Node.js**]() : A popular programming language used for Back-end Designing in Web applications. Used here for API interactions.
---
## Developer's Guide 💻

### **Prerequisites: Create Slack Bot and all required API Keys 🔑**

1. Go to the [SlackApi](https://api.slack.com/start/quickstart) website and click on the "Create New App" button

2. Once you have created a Slack App, go to the OAuth & Permissions tab and provide all required Scopes as shown below.
    - app_mentions:read
    - channels:history
    - chat:write
    - commands
    - groups:history
    - im:history

3. Make sure that Socket Mode and Interactivity is Enabled.

4. Create a slash command with the following details:
    - **Name:** /searchwithcoveo
    - **Description:** /slack/events

5. Keep a Copy of credentials like Slack Signing Secret, Slack Bot token and Slack App token. You can get them in the Basic Information tab. Now install the application in your Slack Workspace.

*Note: Keep your API key confidential and do not share it with anyone. Also, make sure to follow the Slack API usage guidelines to avoid any misuse of the API.*

6. Also, in Coveo Admin Console, Create an organization and generate an API Key. Refer [this](https://docs.coveo.com/en/1718/manage-an-organization/manage-api-keys)

7. Now, use Push API to push data from local setup to Coveo data source. Refer [this](https://docs.coveo.com/en/68/index-content/use-the-push-api) for details. One [example](https://docs.coveo.com/en/1336/index-content/push-api-usage-example) can also be found here.

8. Keep your Organization Id and Api Key for Einstein-GPT ready too.

9. Data can also be pushed into Salesforce Data Cloud. You can refer [this](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_getting_started_with_cdp.htm) for the purpose. However, it is not mandatory here as we have pushed data directly into Coveo data source.

### **Run on local setup**
1  Clone our github [repo]()

```bash
git clone https://github.com/
```
2. Install all dependencies

```
npm i
```
*Make Sure that Node and NPM is installed in your system*

3. Create a .env file and provide all secret keys as mentioned in env.sample file

3. Run app.py in the terminal
```
node run app.py
```
