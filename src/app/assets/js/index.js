require('dotenv').config({ silent: true });
const format = require('date-fns/format');
const path = require('path');
const fs = require('fs');

const message_init = 'salutation';

const querySelector = (parm) => document.querySelector(parm);

//SETTINGS
const bot_name = process.env.bot_name;
const person_name = process.env.person_name;
querySelector('#bot-name').textContent = bot_name;

const fileJSON = JSON.parse(
  fs.readFileSync(`${path.resolve('src/database/intents.json')}`, 'utf8')
);

// Starting conversation
const initDialog = () => botResponse(message_init);
window.onload = () => initDialog();

// Listening submit
querySelector('#form').addEventListener('submit', (event) => {
  const msgerInput = querySelector('.msger-input');
  event.preventDefault();

  let msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(person_name, 'person', 'right', msgText);
  botResponse(msgerInput.value);
  msgerInput.value = '';
});

const appendMessage = (name, author, side, text) => {
  const msgHTML = `<div class="msg ${side}-msg">
                        <div class="msg-img avatar-${author}"></div>
                          <div class="msg-bubble">
                            <div class="msg-info">
                              <div class="msg-info-name">${name}</div>
                                <div class="msg-info-time">${format(
                                  new Date(),
                                  'HH:mm'
                                )}</div>
                            </div>
                            <div class="msg-text">${text}</div>
                        </div>
                    </div>`;

  querySelector('.msger-chat').insertAdjacentHTML('beforeend', msgHTML);
  querySelector('.msger-chat').scrollTop += 1000;

  return msgHTML;
};

const botResponse = (search) => {
  fileJSON.intents.filter((response) => {
    if (response.tag === search) {
      setTimeout(() => {
        appendMessage(bot_name, 'bot', 'left', response.message);
        formSubmit(response.type, response.actions);
      }, 100);
    }
  });
};

window.onchange = () => {
  if (querySelector('input[name=radio]:checked')) {
    let select = querySelector('input[name=radio]:checked').value;
    let labelValue = querySelector(`label[for="${select}"]`).textContent;

    appendMessage(person_name, 'person', 'right', labelValue);

    if (select === message_init) {
      querySelector('.msger-chat').innerHTML = '';
    }
    botResponse(select);
  }
};

const formSubmit = (type, actions) => {
  let element = document.querySelector('#form');
  let inputarea = document.querySelector('.msger-inputarea');
  let buttonActions = document.querySelector('.buttom-actions');

  inputarea && inputarea.remove();
  buttonActions && buttonActions.remove();
  switch (type) {
    case 'input':
      element.innerHTML = `<div class="msger-inputarea">
                              <input type="text" class="msger-input" placeholder="Digite aqui...">
                              <button type="submit" class="button-send"></button>
                            </div>`;
      break;
    case 'button':
      actions.payload.map((response, key) => {
        element.innerHTML += `<div id="${key}" class="inputGroup">
                                <input id="${response.value}" name="radio" type="radio" value="${response.value}"/>
                                <label for="${response.value}">${response.label}</label>
                            <div>`;
      });

      element.innerHTML = `<div class="buttom-actions">${element.innerHTML}</div>`;
      break;
  }

  return element;
};
