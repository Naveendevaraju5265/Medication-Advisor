const apiKey = "";  //here, mention your chatgpt pro version api key

const setupTextarea = document.getElementById('input-textarea');
const setupImg = document.getElementById('output-img');
const setupInputContainer = document.getElementById('setup-input-container');
const movieBossText = document.getElementById('movie-boss-text');
const outputContainer = document.getElementById('output-container');
const outputText = document.getElementById('output-text');
const outputText1 = document.getElementById('output-text1');
const outputImgContainer = document.getElementById('output-img-container');

const url = "https://api.openai.com/v1/completions";
const url1 = 'https://api.openai.com/v1/images/generations'

document.getElementById("submit-btn").addEventListener("click", () => {
  outputText.innerText = "Ok, just wait a second while my digital brain digests that...";
  console.log(setupTextarea.value, "Hello");
  fetchMedicineReply(setupTextarea.value);
  fetchBotReply(setupTextarea.value);
  generateImage(setupTextarea.value);
});

async function fetchMedicineReply(prompt) {
  console.log(prompt);
  try {
    const fewShotExamples = `
            Example 1:
            Symptom: headache for 0-4 years kid.
            Advice: give only syrups not any tables or injections, if it is not cured visit suitable hospital and take the treatment.

            Example 2:
            Symptom: diseases for age above 65. 
            Advice: give suggession only about the suitable medication that not like syrups or very strong medicines.

            Example 3:
            Symptom: diseases for age above 10 and youngsters age limit lies 10-50.
            Advice: advise very reactive and strong medicines which cure fastly and work immediately.

            Symptom: ${prompt}
            Advice:
        `;
      let response = await fetch(url, {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              "model": 'gpt-3.5-turbo-instruct',
              "prompt":fewShotExamples ,
              "max_tokens": 200,
              "temperature": 0.1
          })
        });
        console.log(response);

      const data = await response.json();
      const botReply = data.choices[0].text.trim();
      console.log(botReply,"Hello");
      outputText1.innerText = botReply;
  } catch (error) {
      console.error('Error:', error);
      outputText.innerText = "Sorry, something went wrong. Please try again.";
  }
}

async function fetchBotReply(prompt) {
  console.log(prompt);
  try {
      let response = await fetch(url, {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
              "model": 'gpt-3.5-turbo-instruct',
              "prompt": `Generate a response based on "${prompt}". Give it in one line that which medicines we are supposed to use with age limit and  give full description in 5 to 10 lines.`,
              "max_tokens": 150,
              "temperature": 0.7
          })
        });
        console.log(response);

      const data = await response.json();
      const botReply1 = data.choices[0].text.trim();
      console.log(botReply1,"Hello");
      outputText.innerText = botReply1;
  } catch (error) {
      console.error('Error:', error);
      outputText.innerText = "Sorry, something went wrong. Please try again.";
  }
}

function generateImage(prompt) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt:' Generate a image based if the age is lies between 0-4 give only liquid form medicine images, if not give images based the given medicine in the below description "${botreply}".',
      n: 1,
      size: '256x256',
      response_format: 'b64_json'
    })
  };

  fetch(url1, requestOptions)
    .then(response => response.json())
    .then(data => {
      const imageData = data.data[0].b64_json;
      setupImg.innerHTML = `<img src="data:image/png;base64,${imageData}">`;
    })
    .catch(error => console.error(error));
}