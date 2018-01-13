import SocketIOClient from 'socket.io-client';
import AppConstants from 'src/constant/AppConstants.constant.js';
import chrono from 'chrono-node';

class ChatBot {
  constructor(drugs) {
    this.socket = null;
    this.instructions = {};
    self.drugs = drugs;
    console.log(drugs);
  }

  parseIntent = (message) => {
    regex = /^\/(\w+)(?:\s+(.*)?)?/;
    
    const result = message.match(regex);
    console.log(result);
    if(result === null)  return [null, null];
    else return result.slice(1, 3);
  }

  setDrug = (command) => {
    console.log(command);
    [drug, time, amount] = command.split(", ");
    parsed_time = chrono.parseDate(time);
    amount = parseInt(amount);
    console.log(drug);
    if (amount < 0)
      return "amount can't be set less than 1 !";
    if (!self.drugs.includes(drug))
      return `drug ${drug} not found !`;
    if (!(parsed_time instanceof Date))
      return `${time} is not a valid time!`;

    const key = [drug, parsed_time].join(",");
    this.instructions[key] = amount;
    let template = (drug, parsed_time, amount) =>
      `${drug}\t${parsed_time.getHours()}\t${amount}`;
    let lines = [];
    for (let key in this.instructions) {
      [drug, parsed_time] = key.split(",");
      parsed_time = new Date(parsed_time);
      lines.push(template(drug, parsed_time, this.instructions[key]));
    }
    const reply = lines.join("\n");
    return reply;
  }

  delDrug = (command) => {
    console.log(command);
    [drug, time] = command.split(", ");
    parsed_time = chrono.parseDate(time);
    amount = parseInt(amount);
    console.log(drug);
    if (amount < 0)
      return "amount can't be set less than 1 !";
    if (!self.drugs.includes(drug))
      return `drug ${drug} not found !`;

    const key = [drug, parsed_time].join(",");
    delete this.instructions[key];
    let template = (drug, parsed_time, amount) =>
      `${drug}\t${parsed_time.getHours()}\t${amount}`;
    let lines = [];
    for (let key in this.instructions) {
      [drug, parsed_time] = key.split(",");
      parsed_time = new Date(parsed_time);
      lines.push(template(drug, parsed_time, this.instructions[key]));
    }
    const reply = lines.join("\n");
    return reply;
  }

  getPrescription = () => {
    const prescription = Object.keys(this.instructions).map(drug_time => {
      const amount = this.instructions[drug_time];
      [drug, time] = drug_time.split(",");
      time = new Date(time);
      console.log(time);      
      return {
        drug,
        time,
        amount
      }
    });
    console.log(prescription);
    return prescription;
  }

  reply = (message) => {
    [intent, command] = this.parseIntent(message);
    console.log(command);    
    console.log(intent);    
    switch (intent) {
      case "setdrug":
        return {
          "message": this.setDrug(command),
          "action": "setDrug"
        };
      break;
      case "deldrug":
        return {
          "message": this.delDrug(command),
          "action": "delDrug"
        };  
      break;      
      case "register":
        return {
          "message": "registering",
          "action":"register"
        };
      break;
      case null:
        return {
          "message": "intent not found ! you can type \"/setDrug drugA,12:00,3\" or \"/register\"",
          "action": null
        }
      break;
    }

    const reply = lines.join("\n");
    return reply;
  }

}


module.exports = ChatBot;
