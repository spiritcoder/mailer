import {DBConnection} from './utils/database'
import {app} from './app'

//connect to database
DBConnection()

if (app.listen(process.env.PORT)) {
  console.log("Node is listening to Port " + process.env.PORT);
}
else {
  console.log("An error occured");
}
