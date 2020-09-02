import pkg from 'googleapis';
const { google } = pkg

const spreadsheetId = '14iHVub5lhpK4_IeshhHALnRyKDbob14npwo7OPCFvwM'
const APIKey = process.env.GOOGLE_API_KEY
const sheets = google.sheets({version: "v4", auth: APIKey});

export default {
  name: 'dual',
  description:'dual universe',
  usage: '[argument]',
  async execute(message) {
    
    if(message)
      message.reply('getting the information')

    sheets.spreadsheets.get({ spreadsheetId }, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      sheets.spreadsheets.values.batchGet(
        {
          spreadsheetId,
          ranges: res.data.sheets.map(e => e.properties.title)
        },
        (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(JSON.stringify(res.data));
        }
      );
    });
  }
}
