const sheetName = 'Sheet1';
const scriptProp = PropertiesService.getScriptProperties();

// Initial setup to save the spreadsheet ID in script properties
function intialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

// Function to handle POST requests and store data in the sheet
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);  // Attempt to get the script lock for 10 seconds

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    // Map the incoming data based on headers, and format the date with time for the 'Date' field
    const newRow = headers.map(function (header) {
      return header === 'Date' ? formatDateTime(new Date()) : e.parameter[header];
    });

    // Add the new row to the sheet
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // Send an email notification
    sendEmailNotification(newRow, headers);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();  // Release the lock after the operation
  }
}

// Function to format the date and time with short month names
function formatDateTime(date) {
  const year = date.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];  // Get the short name of the month
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = ('0' + date.getDate()).slice(-2);
  const dayName = dayNames[date.getDay()];  // Get the name of the day
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${dayName} ${day}-${month}-${year} at ${hours}:${minutes}:${seconds}`;
}

// Function to send an email notification after form submission
function sendEmailNotification(newRow, headers) {
  // const emailAddress = 'm41973121@gmail.com';
  const emailAddress = 'mohamedbadrportfolio@gmail.com';
  const displayName = 'Mohamed Badr | Portfolio';
  const subject = 'New Client Contact via Portfolio';

  // Email content (HTML Body)
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <!-- Header with logo -->
      <div style="text-align: center;">
        <img src="https://muhamed-badr.github.io/assets/img/email_logo.png" alt="Your Logo" style="width: 150px;">
      </div>

      <!-- Body Content -->
      <div style="padding: 20px;">
        <h2 style="color: #333;">New Client Contact via Portfolio</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #666;">
          You have received a new form submission. Below are the details:
        </p>

        <!-- Form Data in a Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <th style="text-align: left; padding: 8px; background-color: #f4f4f4;">Field</th>
            <th style="text-align: left; padding: 8px; background-color: #f4f4f4;">Details</th>
          </tr>
          <tr>
            <td style="padding: 8px;">Date</td>
            <td style="padding: 8px;">${newRow[0]}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Name</td>
            <td style="padding: 8px;">${newRow[1]}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Email</td>
            <td style="padding: 8px;">${newRow[2]}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Phone</td>
            <td style="padding: 8px;">${newRow[3]}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Message</td>
            <td style="padding: 8px; white-space: pre-wrap;">${newRow[4]}</td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #999;">
          This email was sent automatically by your portfolio contact form. Please do not reply to this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; background-color: #f4f4f4;">
        <p style="font-size: 12px; color: #666;">&copy; 2024 Your Portfolio. All rights reserved.</p>
      </div>
    </div>
  `;


  // Send the email
  MailApp.sendEmail({
    to: emailAddress,
    subject: subject,
    htmlBody: emailBody,
    name: displayName
  });
}
