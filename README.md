![Banner Image](/src/app-assets/shiftify-banner.png)

# <img src="/src/app-assets/logo-rounded.png" width="32"> Shiftify

Effortlessly Track Your Work Hours and Sync Them to Google Sheets

Shiftify is a user-friendly desktop application built with React, Vite.js, Electron, Electron-vite, Express, Google Sheets API, and TypeScript. It empowers you to effortlessly track your work shifts, record your hours, and seamlessly synchronize them with a designated Google Sheet page, streamlining your timesheet management.

## Technologies Used

- React: Declarative UI library for building interactive user interfaces.
- Vite.js: Modern build tool for fast development experience.
- Electron: Framework for building cross-platform desktop applications using web technologies.
- Electron-vite: Integration tool to combine the strengths of Vite and Electron.
- Express: Web framework for handling server-side logic (used for Google Sheets API interaction).
- Google Sheets API: Enables programmatic access to Google Sheets for automated data management.
- TypeScript: Superset of JavaScript for robust type safety and improved code maintainability.

## Installation and Usage

### Prerequisites

- Node.js (version 18 or higher) installed on your system: [Download Node.js](https://nodejs.org/en/download)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/tarik-amaterasu/time-tracking
   cd shiftify
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

This will launch Shiftify in a development window for testing and debugging.

### Building the Application (Optional)

Build a production-ready executable:

```bash
npm run build
```

This will create a distributable package in the **`/out`** folder.

## MIT License

This project is licensed under the MIT License, granting you the freedom to use, modify, and distribute it freely. You can find the full license terms within the \`**LICENSE**\` file.

## Basic Project Setup

To ensure seamless integration with Google Sheets, follow these essential steps:

**1. Enable Google Sheets API:**

- Visit the Google Cloud Platform (GCP) Console: [GCP Console](https://console.cloud.google.com/)
- Create or select a project.
- Navigate to "APIs & Services" -> "Library".
- Search for "Google Sheets API" and enable it.

**2. Create Service Account and Download JSON Key:**

- Go to "APIs & Services" -> "Credentials".
- Click "Create credentials" -> "Service account key".
- Select "JSON" as the key type and download the file securely.
- Store this JSON key file (e.g., credentials.json) in your project's root directory.

**3. Create a Google Sheet and Share Access:**

- Open Google Sheets and create a new spreadsheet.
- Share the spreadsheet with the email address associated with your service account JSON key. Grant "Editor" permission.

**4. Create a Sheet Page and Extract Sheet ID:**

- Within the shared spreadsheet, create a new sheet page for Shiftify's data storage.
- Right-click on the sheet name and select "Get link..."
- Copy the URL from the "Link to spreadsheet" section.
- To extract the sheet ID, look for the part of the URL after "/d/" and before "/edit". This is your sheet ID.
  Example URL: `https://docs.google.com/spreadsheets/d/1234567890ABCDEFGHIJKLMNOP/edit` -> Sheet ID: `1234567890ABCDEFGHIJKLMNOP`

**5. Configure Shiftify Settings:**

- Open Shiftify.
- Go to Settings (_gear icon_).
- Click "Browse" and select the downloaded JSON key file (credentials.json).
- Paste the extracted sheet ID from step 4.
- Click the reload icon to load pages.
- Select the desired sheet page name from the dropdown menu.
- Click "Save" (Floppy Icon) to apply the settings.

## Using Shiftify:

### Tracking Work Hours:

1. Launch Shiftify.
2. The application interface will typically display a prominent "Shift" button or similar control.
3. Click the "Shift" button to initiate tracking your work hours. The

# FAQ

#### How do I sync my work hours with Google Sheets?

Shiftify uses the Google Sheets API to sync your work hours with a designated Google Sheet. Follow the [Basic Project Setup](#basic-project-setup) section in the README to set up the Google Sheets API integration.

#### Can I customize the categories for tracking work hours?

Yes, Shiftify allows you to customize the categories for tracking work hours. You can add, remove, or edit categories in the settings menu of the application.

#### How does Shiftify work?

Shiftify is a desktop application that allows you to effortlessly track your work hours. Simply click the "Shift" button to start tracking and click it again to stop. Shiftify automatically keeps track of your work hours for accurate timesheet recording. Additionally, Shiftify integrates with Google Sheets, allowing you to seamlessly synchronize your work hours with a designated spreadsheet, eliminating the need for manual data entry.

#### How do I integrate Shiftify with Google Sheets?

Shiftify offers a user-friendly setup process for Google Sheets integration. You'll need to enable the Google Sheets API, create a service account and download the JSON key, create a Google Sheet and share access, and configure Shiftify with the extracted Sheet ID and downloaded JSON key. The detailed steps can be found in the "Basic Project Setup (Google Sheets Integration)" section of this documentation.

#### How do I stop the app and send my data to Google Sheets?

In most cases, clicking the "Stop" or "End Shift" button within Shiftify will stop the timer and potentially prompt you to confirm sending data to Google Sheets. Alternatively, Shiftify might automatically synchronize data at set intervals or upon stopping the application. You can also look for a "Sync Now" or "Send Data" button within the interface to manually trigger data synchronization.

#### Where can I download Shiftify?

Link will be here soon.

#### Is there any support available for Shiftify?

We strive to provide comprehensive documentation for Shiftify. However, if you encounter any issues or have further questions, feel free to reach out to us at [ta.amatera@gmail.com](mailto:ta.amatera@gmail.com).

#### I have another question that's not listed here.

No problem! Feel free to send your question to [ta.amatera@gmail.com](mailto:ta.amatera@gmail.com) and we'll be happy to help.
