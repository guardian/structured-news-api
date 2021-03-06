# Structured News API

Voice Lab Project. This takes the Morning Briefing and extracts structured data from it. This is a firebase function.

## API Parameters

### noAudio:

Can be set to true or false. If not set it defaults to false. When set to true API will generate the stories and the SSML but will not create an audio file from the SSML

### locale: There are news templates for the UK, US and Australia.

Params:

- 'en-AU' : returns a Australian focused briefing
- 'en-CA' & 'en-US' : returns a US focused briefing
- all other values including 'en-GB', 'en-IN', 'en-SG' and when no locale is provided: returns a UK focused briefing

## Current Structured Data Rules

These rules are also documented [here](https://docs.google.com/spreadsheets/d/1rmASsmOjUHWHB4uHtLgjK9iUxzPhYc0Bax6n3FDYyB8/edit#gid=105431519) for editorial.

### If it's between 6:30am and 10:30am on a week day in the UK locale

- Three Top Stories - These are the first three stories in the morning briefing. For each story take the first two sentences about it in the [morning briefing](https://www.theguardian.com/world/series/guardian-morning-briefing)
- Today in Focus - For the Today in Focus article for the day get the headline and first 2 sentences of the standfirst.
- Forth Top Story - Forth story in the [Morning Briefing](https://www.theguardian.com/world/series/guardian-morning-briefing).

### Fallback

For when none of the other conditions are true or the generation fails. There are versions of the fallback for the UK, US and Australia. The template is made up of the following sections:

- Three Top Stories - These are from the editor's picks for the locale selected. Sourced from CAPI.
- Trending Article - The first article when querying `http://content.guardianapis.com/<locale>` by most-viewed.
- Forth Top Story - Forth story from the editor's picks. Sourced from CAPI.

### If it's a Saturday in the UK locale (6am on Saturday to 5:59am on Sunday)

- Three Top Stories - These are from the editor's picks for the locale selected. Sourced from CAPI.
- Audio Long Read - For Monday's Audio Long Read article get the headline and trailtext.
- Trending Article - The first article when querying `http://content.guardianapis.com/uk` by most-viewed.

### If it's a Sunday in the UK locale (6am on Sunday to 5:59am on Monday)

- Three Top Stories - These are from the editor's picks for the locale selected. Sourced from CAPI.
- Audio Long Read - For Fridays's Audio Long Read article get the headline and trailtext.
- Trending Article - The first article when querying `http://content.guardianapis.com/uk` by most-viewed.

## General Article Rules

Whenever we pull an article from CAPI (not including when we pull a Podcast article) we follow these rules:

- An article must have:
  - the pillarId pillar/news
  - the article type 'article'
  - body text
- An article must not have
  - the morning briefing tag.
  - the Guardian Readers contributor tag on it.
  - the analysis tone tag on it.
  - the features tone tag on it.
  - the opinion tone tag on it.
  - the id of the 2019 April Fools Article.

# Set Up

- You need permission to access the google cloud project
- You need the [firebase cli](https://github.com/firebase/firebase-tools) installed
- You need to log in to firebase using `firebase login`
- You need to run `yarn install` from inside the `functions` directory
- You need to set up environnement variables
- You need to have service account credentials locally

## Environment Variables

This project requires environment variables. Run `firebase functions:config:get > .runtimeconfig.json` in the `functions` directory to run the function locally.

# Service Account Credentials

The app also requires a service account ID.

1. Go to the Google Cloud Console for the project
2. Go to IAM & Admin
3. Go to Service Accounts
4. Select the account called `UploadBriefing` and select 'create key'. This will download a key onto your machine.
5. In terminal type `export GOOGLE_APPLICATION_CREDENTIALS=path_to_json_file_containing_key`

## Run locally

1. From inside the `functions` directory run `yarn serve`

Will run the firebase function locally at [http://localhost:5000/year-in-review-138f5/us-central1/structuredNewsApi](http://localhost:5000/year-in-review-138f5/us-central1/structuredNewsApi) and the endpoint can be posted to directly.

[Blog post](https://www.theguardian.com/info/2019/jan/31/hey-google-help-me-use-cloud-functions) on firebase functions locally.

`yarn valid` will run the TypeScipt build step, the linter and all tests.

`yarn test` will run all tests.

## Deploy:

From inside the `functions` directory run `yarn deploy`

This deploys the project to PROD. The deploy steps are outlined in the [firebase.json](./firebase.json) file and the default project ID is defined in [.firebaserc](./.firebaserc).

## Guardian Specific Information

Guardian specific information about the project is available [here](https://github.com/guardian/voicelab-platform) in a private repo.
