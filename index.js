
let app = require("./src/App.js");
app.listen(process.env.server_port, () => {
    console.log("server started");
});