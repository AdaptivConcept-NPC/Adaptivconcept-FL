To handle form submissions on Netlify's free tier, you can use the built-in [Netlify Forms](https://docs.netlify.com/manage/forms/setup/) feature, which automatically parses your HTML to collect data without requiring a back-end server. [1, 2] 
## 1. Basic Setup (No Coding Required)
To enable automatic form handling for static sites, add a single attribute to your HTML <form> tag: [3, 4] 

* Add Attribute: Use data-netlify="true" or simply netlify.
* Identify Form: Include a name attribute so you can distinguish it in the Netlify dashboard.
* Spam Protection: Add a hidden "honeypot" field to trick bots. Netlify will silently ignore submissions where this field is filled. [2, 5, 6, 7, 8] 

## 2. Advanced Handling with Serverless Functions
If you need to perform custom actions (like sending data to a third-party API or database) upon submission, you can use Netlify Functions: [9, 10] 

   1. Create Function: Add a file named submission-created.js in your netlify/functions directory.
   2. Automatic Trigger: Netlify automatically triggers this specific function every time a verified form submission is received.
   3. Process Data: The form data is available in the event.body of your function. [9, 11, 12, 13, 14] 

## 3. JavaScript/Framework Setup (React, Vue, etc.) [15] 
If your form is rendered purely via JavaScript (which Netlify's build bots can't see), you must use a workaround: [16, 17, 18] 

* Hidden HTML Form: Create a "shadow" HTML form in your public folder with the same name and input fields as your JS form.
* Hidden Input: Add a hidden field to your dynamic form: <input type="hidden" name="form-name" value="your_form_name" />. [2, 5] 

## 4. Free Tier Limits & Notifications

* Submission Limit: The free tier includes 100 verified submissions per month. Exceeding this may lead to automatic account upgrades or site suspension.
* Notifications: You can set up free email notifications for each submission through the Netlify UI under Configuration > Notifications.
* Storage: Submissions are stored in your [Netlify Forms dashboard](https://docs.netlify.com/manage/forms/submissions/) where you can view, export to CSV, or delete them. [2, 19, 20, 21, 22, 23, 24, 25, 26] 

Would you like a code snippet for a custom success page or a template for the submission-created.js serverless function?

[1] [https://docs.netlify.com](https://docs.netlify.com/manage/forms/setup/)
[2] [https://docs.netlify.com](https://docs.netlify.com/manage/forms/setup/)
[3] [https://dev.to](https://dev.to/chrisachinga/make-you-forms-function-with-netlify-forms-86b#:~:text=Make%20You%20Forms%20Function%20With%20Netlify%20Forms,including%20form%20handling%2C%20yes%20without%20a%20back%2Dend.)
[4] [https://docs.netlify.com](https://docs.netlify.com/manage/forms/setup/)
[5] [https://docs.netlify.com](https://docs.netlify.com/manage/forms/setup/)
[6] [https://www.netlify.com](https://www.netlify.com/blog/2021/12/16/accepting-form-submissions-without-a-server/)
[7] [https://css-tricks.com](https://css-tricks.com/using-netlify-forms-and-netlify-functions-to-build-an-email-sign-up-widget/)
[8] [https://css-tricks.com](https://css-tricks.com/using-netlify-forms-and-netlify-functions-to-build-an-email-sign-up-widget/#:~:text=The%20first%20input%20in%20the%20form%20is,setting%20the%20netlify%2Dhoneypot%20attribute%20to%20bot%2Dfield%20.)
[9] [https://www.netlify.com](https://www.netlify.com/blog/2018/09/14/forms-and-functions/)
[10] [https://css-tricks.com](https://css-tricks.com/using-netlify-forms-and-netlify-functions-to-build-an-email-sign-up-widget/)
[11] [https://answers.netlify.com](https://answers.netlify.com/t/problem-passing-form-submission-data-to-custom-function/1244)
[12] [https://www.netlify.com](https://www.netlify.com/blog/2018/09/14/forms-and-functions/)
[13] [https://docs.netlify.com](https://docs.netlify.com/manage/forms/submissions/)
[14] [https://aseifert.com](https://aseifert.com/p/serverless-sentence-transformer/#:~:text=The%20client%27s%20request%20will%20come%20in%20JSON%2Dstringified%20form%20inside%20the%20event%5B%22body%22%5D%20field.)
[15] [https://www.ignitiv.com](https://www.ignitiv.com/shopify-plus-headless-commerce-guide/#:~:text=Developer%20Freedom%20and%20Scalability:%20Use%20any%20JavaScript,Deploy%20globally%20on%20Oxygen%2C%20Vercel%2C%20or%20Netlify.)
[16] [https://mailtrap.io](https://mailtrap.io/blog/netlify-send-email/#:~:text=jsx%20or%20a%20separate%20component%29.%20However%2C%20Netlify%27s,our%20form%2C%20we%20will%20do%20two%20things:)
[17] [https://docs.netlify.com](https://docs.netlify.com/resources/troubleshooting/troubleshooting-faq/)
[18] [https://jpcaparas.medium.com](https://jpcaparas.medium.com/enabling-spa-form-submissions-on-netlify-with-the-hidden-form-technique-e37c2c27f618#:~:text=Netlify%27s%20form%20handling%20relies%20on%20static%20HTML,may%20not%20detect%20them%2C%20necessitating%20a%20workaround.)
[19] [https://answers.netlify.com](https://answers.netlify.com/t/over-100-form-submissions-on-free-tier/16006)
[20] [https://www.staticforms.dev](https://www.staticforms.dev/blog/netlify-forms-vs-static-forms-comparison)
[21] [https://github.com](https://github.com/netlify/ask-netlify/issues/6#:~:text=An%20example%20would%20be:%20*%20adding%20a,%2D%20Level%200%20to%20Level%201%20tier%29.)
[22] [https://www.netlify.com](https://www.netlify.com/pricing/)
[23] [https://dev.to](https://dev.to/olawanle_joel/handling-form-submission-with-netlify-in-less-than-a-minute-1cn0)
[24] [https://docs.netlify.com](https://docs.netlify.com/manage/forms/submissions/)
[25] [https://www.netlify.com](https://www.netlify.com/blog/deploy-an-astro-site-with-forms-serverless-functions-and-redirects/)
[26] [https://www.netlify.com](https://www.netlify.com/blog/2021/12/17/handling-form-submissions-via-the-netlify-api/)


---
## Custom Success Page
To redirect users to a custom "thank you" page instead of the default Netlify one, add the action attribute to your <form> tag. [1, 2] 

<!-- The action path should match a file like 'thanks.html' or '/thanks/' -->
<form name="contact" method="POST" data-netlify="true" action="/thanks">
  <p>
    <label>Name: <input type="text" name="name" /></label>   
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>

## Serverless Function Template (submission-created.js)
You can automate tasks (like sending a custom email or logging data) by placing this file in your netlify/functions folder. Netlify automatically triggers it when a verified form is submitted. [1, 3, 4] 

// netlify/functions/submission-created.js
exports.handler = async (event) => {
  // Netlify sends form data in event.body as a JSON string
  const { payload } = JSON.parse(event.body);
  const formData = payload.data;

  console.log(`New submission from ${formData.name}: ${formData.message}`);

  // You can add logic here to call a third-party API (e.g., Slack, Mailchimp)
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success!" }),
  };
};

Key Notes for the Free Tier:

* Filename Matters: The function must be named exactly submission-created.js (or .ts) to trigger automatically on form events.
* Payload Structure: Always destructure payload.data to access the actual form fields.
* Monitoring: You can view function logs and form submissions in your [Netlify Dashboard](https://docs.netlify.com/manage/forms/submissions/) under the Functions and Forms tabs. [1, 3, 5, 6] 

Do you need help connecting this function to a specific service like Slack or Discord?

def generate_code_snippets():
    # submission-created.js template
    function_code = """
exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  const { data } = payload;

  console.log('Received form submission:', data);

  // Example: Send to another service or log
  // You can fetch external APIs here

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Submission processed!" }),
  };
};"""

    # custom success page form attribute
    html_snippet = """
<form name="contact" method="POST" data-netlify="true" action="/thanks">
  <!-- form fields here -->
</form>"""

    return function_code, html_snippet
function, html = generate_code_snippets()
print(f"Function:\\n{function}\\nHTML:\\n{html}")


[1] [https://www.netlify.com](https://www.netlify.com/blog/deploy-an-astro-site-with-forms-serverless-functions-and-redirects/)
[2] [https://snipcart.com](https://snipcart.com/blog/netlify-forms)
[3] [https://www.raymondcamden.com](https://www.raymondcamden.com/2019/01/15/customized-form-handling-on-netlify-with-serverless-functions)
[4] [https://codeburst.io](https://codeburst.io/write-and-deploy-your-first-serverless-function-within-10-minutes-or-less-d7552fcd6550)
[5] [https://www.netlify.com](https://www.netlify.com/blog/2021/01/12/building-an-event-registration-page-with-composition-api-and-serverless-functions/)
[6] [https://docs.netlify.com](https://docs.netlify.com/manage/forms/submissions/)
