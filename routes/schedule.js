var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(data);
});

const schedule = [
  {
      name: "Sun",
      venues: [
          {
              name: "Main Stage",
              events: [
                  {
                      name: "Qrion",
                      startTime: 19.5,
                      endTime: 20.5
                  }, {
                      name: "ALPHA9 b2b Spencer Brown",
                      startTime: 20.5,
                      endTime: 22
                  }, {
                      name: "Mat Zo",
                      startTime: 22,
                      endTime: 23.5
                  }
              ]
          }, {
              name: "Folie Douce",
              events: [
                  {
                      name: "Amber Stomp",
                      startTime: 15,
                      endTime: 16.5
                  }, {
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
                      name: "Judah",
                      startTime: 23,
                      endTime: 24
                  }, {
                      name: "Dirty South",
                      startTime: 24,
                      endTime: 25.5
                  }, {
                      name: "Fatum",
                      startTime: 25.5,
                      endTime: 26.75
                  }
              ]
          }, {
              name: "Yak",
              events: [
                  {
                      name: "8Kays",
                      startTime: 25,
                      endTime: 27
                  }, {
                      name: "Spencer Brown",
                      startTime: 27,
                      endTime: 29
                  }
              ]
          }
      ]
  }, {
      name: "Mon",
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
                      name: "Amy Wiles",
                      startTime: 14,
                      endTime: 16.5
                  }, {
                      name: "Oliver Smith",
                      subText: "(Anjuna Memories)",
                      startTime: 16.5,
                      endTime: 18.5
                  }, {
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
                      name: "Trance Wax",
                      startTime: 22,
                      endTime: 24
                  }, {
                      name: "Spencer Brown b2b Qrion",
                      startTime: 24,
                      endTime: 25.5
                  }, {
                      name: "ALPHA9",
                      startTime: 25.5,
                      endTime: 26.75
                  }
              ]
          }, {
              name: "Yak",
              events: [
                  {
                      name: "Myon",
                      startTime: 25,
                      endTime: 27
                  }, {
                      name: "Kyau & Albert",
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
