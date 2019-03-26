# Structured News API

Voice Lab Project. This takes the Morning Briefing and extracts structured data from it.

## API Parameters

### locale: There are news templates for the UK, US and Australia.

- 'en-AU' : returns a Australian focused briefing
- 'en-CA' & 'en-US' : returns a US focused briefing
- all other values including 'en-GB', 'en-IN' & 'en-SG': returns a UK focused briefing

## Current Structured Data Rules

### If it's between 6:30am and 10:30am on a week day in the UK locale

- Three Top Stories - These are the first three stories in the morning briefing. For each story take the first sentence about it in the [morning briefing](https://www.theguardian.com/world/series/guardian-morning-briefing)
- Today in Focus - For the Today in Focus article for the day get the headline and first 2 sentences of the standfirst
- Forth Top Story - Forth story in the [Morning Briefing](https://www.theguardian.com/world/series/guardian-morning-briefing).

### Fallback

For when none of the other conditions are true or the generation fails. There are versions of the fallback for the UK, US and Australia. The template is made up of the following sections:

- Three Top Stories - These are from the editor's picks for the locale selected. Sourced from CAPI. The articles must have the pillar id 'pillar/news'. The article must not be a live blog or have the morning briefing tag on it.
- Trending Article - The first article when querying `http://content.guardianapis.com/<locale>` by most-viewed. The article must have the pillar id 'pillar/news'. The article must not be a live blog or have the morning briefing tag on it.
- Forth Top Story - Forth story from the editor's picks. Sourced from CAPI. The article must have the pillar id 'pillar/news'. he article must of of type 'article' and not have the morning briefing tag on it.

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

## Deploy:

From inside the `functions` directory run `yarn deploy`
