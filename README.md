# Budget-19

## Starting Development

When making changes, create a branch with the name `dev-[Jira issue name]`
e.g. `dev-SCRUM-7` and work on that. See [deployment](#deployment) for
instructions on how to deploy your changes.

## Files

Initial page setup (e.g. title): `/index.html`

Router config ([docs](https://reactrouter.com/en/main)): `/src/router.tsx`

## Commands

Sync packages: `npm install`

Serve webpage locally: `npm run dev`

### Firebase

Install Firebase tools: `npm install -g firebase-tools`

Login to Firebase: `firebase login`

Configure Firebase settings: `firebase init`
> :warning: Overwrites current settings!

Configure Firebase emulator(s): `firebase init emulators`

Start Firebase emulator(s): `firebase emulators:start`

## Deployment

> :warning: Do not use `firebase deploy` to deploy! This will circumvent GitHub!

### Test Deployment

Creating a test deployment to Firebase:
```
npm run build
firebase hosting:channel:deploy [Test Deployment Name]
```

### Production Deployment

Making a [pull request](https://github.com/Robert-M-Lucas/budget-19/compare)
will automatically create a test deployment to Firebase (i.e. not
overwrite the production app). You should see a message below your new pull
request notifying you that your changes are being deployed. Click on
the link shown when this is complete to view your changes. The pull
request can them be merged into the `master` branch from which it'll
be automatically deployed to https://budget-19.web.app/.