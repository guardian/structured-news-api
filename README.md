# Structured News API

Voice Lab Project. This takes the Morning Briefing and extracts structured data from it.

## Current Structured Data Rules

- Three Top Stories - These are the first three stories in the morning briefing. For each story take the first sentence about it in the morning briefing
- Today in Focus - For the Today in Focus article for the day get the headline and first 2 sentences of the standfirst
- Trending Article - The first article when querying `http://content.guardianapis.com/uk` by most-viewed. The article must have the pillar id 'pillar/news'. The article must not be a live blog or have the morning briefing tag on it.

# Set Up

- You need permission to access the google cloud project
- You need the [firebase cli](https://github.com/firebase/firebase-tools) installed
- You need to log in to firebase using `firebase login`
- You need to set up environnement variables

## Environment Variables

This project requires environment variables. Run `firebase functions:config:get > .runtimeconfig.json` in the `functions` directory to run the function locally.

# Running Locally

Use `yarn serve` to run locally

# Deploying

Use `yarn deploy` to deploy.
