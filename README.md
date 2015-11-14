##Blizzard Take-Home Test (World of Warcraft API)

####Live Website:
http://blizzardAPI.herokuapp.com

####Summary:
I used NodeJS's ExpressJS framework with MongooseJS (MongoDB) to simulate a World of Warcraft API that stores account and character data. I only implemented the technical specs (exposing each API command). I did not implement the rules (race-class compatibility, level bounding, etc.) since those would have taken much longer. It is for this same reason that I have not implemented any capitalization-checking - Please make sure your API calls use the same lower/uppercase when setting/searching for names.

The full spec is attached under Blizzard_Automation_API_Spec.txt

Feel free to try them youself! The database is open to anyone- just use Postman REST client. When making POST requests, make sure the input is sent as "x-www-form-urlencoded."

####The example commands from the spec are pasted below.

•         GET {your-service-url}/about
                 returns 200 with body of:
                 { "author" : "Jon Doe Applicant", "source" : "/relative/path/to/source/code.language" }

•         POST {your-service-url}/account
                  { "name" : "testaccount" }
                  returns 200 with body of:
                  { "account_id" : 1234 }


•         GET {your-service-url}/account
                  returns 200 with body of (all accounts):
                  { "accounts" : [ { "account_id" : 1234, "account_name" : "blah", "link" : "{your-service-url}/account/blah" }, ... ] }

•         POST {your-service-url}/account/{account_name}/characters
                  { "name" : "Lochtar", "race" : "Orc", "class" : "Druid", "faction" : "Alliance", "level" : 90 }
                  returns 200 with body of:
                  { "character_id" : 1234 }


•         DELETE {your-service-url}/account/{account_name}
                  returns 200

•         DELETE {your-service-url}/account/{account_name}/characters/{character_name}
                  returns 200

•         GET {your-service-url}/account/{account_name}/characters
                  returns 200 with body of:
                  { "account_id" : 1234, "characters" : [ { "character_id" : 1234, "name" : "Lochtar", "race" : "Orc", "class" : "Druid", "faction" : "Alliance", "level" : 90 } ] }
