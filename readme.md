# Workflow for Updating and Deploying Code to Heroku

1. Make Changes Locally
  - Open your project in your IDE or editor.
  - Save your changes after editing the code.

2. Test Changes Locally

Backend:
  1. Navigate to the backend folder:

cd api

  2. Start the backend server:

npm start

  3. Verify:
	- The backend is running on http://localhost:8000.
	- Use tools like Postman, curl, or a browser to test API endpoints.

Frontend:
  1. Navigate to the frontend folder:

cd reactjs

  2. Start the frontend server:

npm start

  3. Verify:
	- The frontend is running on http://localhost:3000.
	- Test functionality in your browser to ensure the frontend connects to the backend correctly.

3. Commit Changes

Check Modified Files:

git status

Stage Changes:

git add .

Commit Changes:

Use a descriptive commit message:

git commit -m "Describe the changes made, e.g., 'Updated AnimeCharacter component styling and logic'"

4. Push Changes to GitHub

Push your committed changes to the main branch:

git push origin main

5. Deploy to Heroku

Using Heroku Git:
  1. Push the changes to Heroku:

git push heroku main

Using GitHub Integration:
  1. Go to your Heroku Dashboard.
  2. Select your app (e.g., bradleycruddemo).
  3. Under the Deploy tab:
	- Connect to GitHub (if not already connected).
	- Select your repository.
	- Deploy the latest branch.

6. Verify Deployment

Open your Heroku app in a browser to ensure the deployment works as intended:

heroku open --app bradleycruddemo

Test all key functionalities, including frontend-backend integration.

7. Debugging Issues

If you encounter problems, check the Heroku logs for detailed error information:

heroku logs --tail --app bradleycruddemo

Look for relevant errors and resolve them locally.

8. Optional: Restart Heroku App

Restart the Heroku app if needed (e.g., environment variable changes):

heroku restart --app bradleycruddemo

9. Important Notes
  - Environment Variables: Ensure your .env file is set up correctly for production, and the necessary variables are configured in Heroku under Settings > Config Vars.
  - Database: Verify that any database changes are applied correctly.
  - Testing: Run final tests on both the frontend and backend.

Example Workflow Commands:
  1. Start the backend locally:

cd api
npm start

  2. Start the frontend locally:

cd reactjs
npm start

  3. Commit changes:

git add .
git commit -m "Updated AnimeCharacter component logic"

  4. Push to GitHub:

git push origin main

  5. Deploy to Heroku:

git push heroku main

  6. Open the live app:

heroku open --app bradleycruddemo

  7. Debug logs:

heroku logs --tail --app bradleycruddemo