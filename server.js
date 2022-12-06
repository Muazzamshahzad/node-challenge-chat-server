const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json())
const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
//Get the messages
app.get("/messages", function (request, response) {
  response.send(messages)
});
//Add message 
app.post('/messages', function(request, response) {
  const message = request.body;
  if (message.from ==undefined ||
      message.text == undefined){
      return response.status(400).send({success: false})
    }else{
  message.timeSent = new Date()
  message.id = messages.length
  messages.push(message)
  response.status(201).send(message)
  }
})

//Delete message by ID
app.delete("/messages/:id", function(request, response){
  const id = request.params.id;
  const filteredID = messages.filter((message) => {
    return message.id != id;
  });
  messages = filteredID;
  response.send({ success: true });
});
//Search messages by text
app.get("/messages/search", function(request, response){
  const termParam = request.query.text.toLowerCase()
  const result = messages.filter(function (message){
    return message.text.toLowerCase().includes(termParam) || message.from.toLowerCase().includes(termParam)
  })
  response.send(result)
});
//Display latest messages
app.get("/messages/latest", function(request, response){
  let latestMessages = messages.reverse().slice(0,10)
  response.send(latestMessages);
})
//Get message by ID
app.get("/messages/:id", function(request, response){
  const id = request.params.id;
  const result = messages.find(function(message){return message.id == id})
response.send(result)
})


app.listen(3000, () => {
   console.log(`http://localhost:3000/`)
  });
