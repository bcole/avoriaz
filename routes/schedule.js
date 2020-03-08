var express = require('express');
var router = express.Router();

var ShortUID = require('short-uid');
var uid = new ShortUID();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/avoriaz', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to DB');
});

var scheduleSchema = new mongoose.Schema({
    id: String,
    schedule: Schema.Types.Mixed
});

var ScheduleModel = mongoose.model('Schedule', scheduleSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(data);
});

router.get('/saved', function(req, res, next) {
    const id = req.query.id;
    if(!id) {
        // TODO - throw an error.
        return res.json({});
    }

    ScheduleModel.find({id}, (err, schedules) => {
        if(err) {
            res.json({error: "Internal Server Error"});
        } else {
            res.json(schedules && schedules[0] && schedules[0].schedule || {});
        }
    });
});

router.post('/saved', function(req, res, next) {
    const id = uid.randomUUID(8);

    const scheduleToSave = new ScheduleModel({id, schedule: req.body});
    scheduleToSave.save((err) => {
        if(err) {
            res.json({error: "Internal Server Error"});
        } else {
            res.json({id});
        }
    });
})

const schedule = [
  {
      name: "Sun",
      longName: "Sunday",
      venues: [
          {
              name: "Main Stage",
              events: [
                  {
                      id: 1,
                      name: "Qrion",
                      startTime: 19.5,
                      endTime: 20.5
                  }, {
                      id: 2,
                      name: "ALPHA9 b2b Spencer Brown",
                      startTime: 20.5,
                      endTime: 22
                  }, {
                      id: 3,
                      name: "Mat Zo",
                      startTime: 22,
                      endTime: 23.5
                  }
              ]
          }, {
              name: "Folie Douce",
              events: [
                  {
                      id: 4,
                      name: "Amber Stomp",
                      startTime: 15,
                      endTime: 16.5
                  }, {
                      id: 5,
                      name: "Dirty South",
                      subText: "(Classic House Anthems)",
                      startTime: 16.5,
                      endTime: 18.5
                  }
              ]
          }, {
              name: "Apres Stage",
              events: []
          }, {
              name: "Beats Club",
              events: [
                  {
                      id: 6,
                      name: "Judah",
                      startTime: 23,
                      endTime: 24
                  }, {
                      id: 7,
                      name: "Dirty South",
                      startTime: 24,
                      endTime: 25.5
                  }, {
                      id: 8,
                      name: "Fatum",
                      startTime: 25.5,
                      endTime: 26.75
                  }
              ]
          }, {
              name: "Yak",
              events: [
                  {
                      id: 9,
                      name: "8Kays",
                      startTime: 25,
                      endTime: 27
                  }, {
                      id: 10,
                      name: "Spencer Brown",
                      startTime: 27,
                      endTime: 29
                  }
              ]
          }
      ]
  }, {
      name: "Mon",
      longName: "Monday",
      venues: [
          {
              name: "Main Stage",
              events: []
          }, {
              name: "Folie Douce",
              events: []
          }, {
              name: "Apres Stage",
              events: [
                  {
                      id: 11,
                      name: "Amy Wiles",
                      startTime: 15,
                      endTime: 16.5
                  }, {
                      id: 12,
                      name: "Oliver Smith",
                      subText: "(Anjuna Memories)",
                      startTime: 16.5,
                      endTime: 18.5
                  }, {
                      id: 13,
                      name: "D&G FTO",
                      subText: "(Anjuna Memories)",
                      startTime: 18.5,
                      endTime: 20
                  }
              ]
          }, {
              name: "Beats Club",
              events: [
                  {
                      id: 14,
                      name: "Trance Wax",
                      startTime: 22,
                      endTime: 24
                  }, {
                      id: 15,
                      name: "Spencer Brown b2b Qrion",
                      startTime: 24,
                      endTime: 25.5
                  }, {
                      id: 16,
                      name: "ALPHA9",
                      startTime: 25.5,
                      endTime: 26.75
                  }
              ]
          }, {
              name: "Yak",
              events: [
                  {
                      id: 17,
                      name: "Myon",
                      startTime: 25,
                      endTime: 27
                  }, {
                      id: 18,
                      name: "Kyau & Albert",
                      startTime: 27,
                      endTime: 29
                  }
              ]
          }
      ]
  }, {
    name: "Tue",
    longName: "Tuesday",
    venues: [
        {
            name: "Main Stage",
            events: [
                {
                    id: 19,
                    name: "Oliver Smith",
                    startTime: 19.5,
                    endTime: 20.5
                }, {
                    id: 20,
                    name: "Cosmic Gate",
                    startTime: 20.5,
                    endTime: 22
                }, {
                    id: 21,
                    name: "Seven Lions",
                    startTime: 22,
                    endTime: 23.5
                }
            ]
        }, {
            name: "Folie Douce",
            events: [
                {
                    id: 22,
                    name: "La Push",
                    startTime: 15,
                    endTime: 16.5
                }, {
                    id: 23,
                    name: "D&G FTO",
                    startTime: 16.5,
                    endTime: 18.5
                }
            ]
        }, {
            name: "Apres Stage",
            events: []
        }, {
            name: "Beats Club",
            events: [
                {
                    id: 24,
                    name: "Josep",
                    startTime: 23,
                    endTime: 24
                }, {
                    id: 25,
                    name: "Sunny Lax",
                    startTime: 24,
                    endTime: 25.5
                }, {
                    id: 26,
                    name: "Genix",
                    startTime: 25.5,
                    endTime: 26.75
                }
            ]
        }, {
            name: "Yak",
            events: [
                {
                    id: 27,
                    name: "Mat Zo",
                    subText: "(D&B Set)",
                    startTime: 25,
                    endTime: 27
                }, {
                    id: 28,
                    name: "Tinlicker",
                    subText: "(House Set)",
                    startTime: 27,
                    endTime: 29
                }
            ]
        }
    ]
  }, {
    name: "Wed",
    longName: "Wednesday",
    venues: [
        {
            name: "Main Stage",
            events: []
        }, {
            name: "Folie Douce",
            events: []
        }, {
            name: "Apres Stage",
            events: [
                {
                    id: 29,
                    name: "Grum",
                    subText: "(Archives Set)",
                    startTime: 15,
                    endTime: 16.5
                }, {
                    id: 30,
                    name: "Maor Levi",
                    subText: "(Anjuna Memories)",
                    startTime: 16.5,
                    endTime: 18.5
                }, {
                    id: 31,
                    name: "Jon O'Bir",
                    startTime: 18.5,
                    endTime: 20
                }, {
                    id: 32,
                    name: "Gem & Tauri",
                    subText: "(Ophelia)",
                    startTime: 22,
                    endTime: 23
                }, {
                    id: 33,
                    name: "Crystal Skies",
                    subText: "(Ophelia)",
                    startTime: 23,
                    endTime: 24
                }, {
                    id: 34,
                    name: "Blastoyz",
                    subText: "(Ophelia)",
                    startTime: 24,
                    endTime: 25.25
                }, {
                    id: 35,
                    name: "Seven Lions",
                    subText: "(Ophelia)",
                    startTime: 25.25,
                    endTime: 26.75
                }
            ]
        }, {
            name: "Beats Club",
            events: [
                {
                    id: 36,
                    name: "DT8 Project",
                    startTime: 25,
                    endTime: 27
                }, {
                    id: 37,
                    name: "Nitrous Oxide",
                    subText: "(Anjuna Memories)",
                    startTime: 27,
                    endTime: 29
                }
            ]
        }, {
            name: "Yak",
            events: []
        }
    ]
  }, {
    name: "Thu",
    longName: "Thursday",
    venues: [
        {
            name: "Main Stage",
            events: []
        }, {
            name: "Folie Douce",
            events: [
                {
                    id: 38,
                    name: "Amy Wiles",
                    startTime: 15,
                    endTime: 16
                }, {
                    id: 39,
                    name: "PROFF",
                    startTime: 16,
                    endTime: 17.5
                }, {
                    id: 40,
                    name: "Tinlicker",
                    startTime: 17.5,
                    endTime: 19
                }, {
                    id: 41,
                    name: "Grum",
                    startTime: 19,
                    endTime: 20.5
                }, {
                    id: 42,
                    name: "ilan Bluestone",
                    startTime: 20.5,
                    endTime: 22
                }
            ]
        }, {
            name: "Apres Stage",
            events: []
        }, {
            name: "Beats Club",
            events: [
                {
                    id: 43,
                    name: "Jaytech",
                    startTime: 23,
                    endTime: 24
                }, {
                    id: 44,
                    name: "Maor Levi",
                    startTime: 24,
                    endTime: 25.5
                }, {
                    id: 45,
                    name: "Super8 & Tab",
                    startTime: 25.5,
                    endTime: 26.75
                }
            ]
        }, {
            name: "Yak",
            events: [
                {
                    id: 46,
                    name: "Amber Stomp b2b Amy Wiles",
                    startTime: 25,
                    endTime: 27
                }, {
                    id: 47,
                    name: "D&G FTO b2b Jon O'Bir",
                    startTime: 27,
                    endTime: 29
                }
            ]
        }
    ]
  }
]
const startTime = 15;
const endTime = 28;
const granularity = 4;  // Allows 15min breaks

const data = {schedule, startTime, endTime, granularity};

module.exports = router;
