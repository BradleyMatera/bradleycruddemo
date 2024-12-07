# Workflow for Updating and Deploying Code to Heroku

## **1. Make Changes Locally**

- Edit your code in your preferred IDE or editor.
- Save your changes.

## **2. Test Changes Locally**

- **Backend:**

  ```bash
  cd api
  npm start
  ```

  - Verify the backend is running on http://localhost:8000.
  - Use tools like Postman or curl to test API endpoints.

- **Frontend:**

  ```bash
  cd reactjs
  npm start
  ```

  - Verify the frontend is running on http://localhost:3000.
  - Test functionality in your browser.

## **3. Commit Changes**

- Check what files have been modified:

  ```bash
  git status
  ```

- Stage the changes:

  ```bash
  git add .
  ```

- Commit the changes with a descriptive message:

  ```bash
  git commit -m "Describe your changes here"
  ```

## **4. Push Changes to GitHub**

- Push your changes to the main branch on GitHub:

  ```bash
  git push origin main
  ```

## **5. Deploy to Heroku**

- If using Heroku Git:
  Push your changes to Heroku:

  ```bash
  git push heroku main
  ```

- If using GitHub integration:
  1. Go to your Heroku dashboard.
  2. Select your app.
  3. Under the Deploy tab, click Deploy Branch.

## **6. Verify Live Changes**

- Open the app in your browser:

  ```bash
  heroku open --app bradleycruddemo
  ```

- Test your changes to ensure everything works.

## **7. Debug Issues (If Any)**

- Check logs to debug:

  ```bash
  heroku logs --tail --app bradleycruddemo
  ```

## **8. Additional Notes**

- Ensure your .env file is configured correctly for production.
- Restart your Heroku app if needed:

  ```bash
  heroku restart --app bradleycruddemo
  ```

Example Workflow Commands:

1. Test locally:

  ```bash
  npm start
  ```

2. Commit changes:

  ```bash
  git add .
  git commit -m "Updated Dashboard component"
  ```

3. Push to GitHub:

  ```bash
  git push origin main
  ```

4. Deploy to Heroku:

  ```bash
  git push heroku main
  ```

5. Verify live app:

  ```bash
  heroku open --app bradleycruddemo
  ```

6. Debug logs:

  ```bash
  heroku logs --tail --app bradleycruddemo
  ```

