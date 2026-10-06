// Green Elephant · AI-LIT: existing public video catalogue; upload dates are unverified.
export const RESOURCE_VIDEOS = {
  "understandingYourDataVideos": [
    {
      "id": "ego",
      "title": "EGO: Satellite Scan Video Coaching",
      "lensType": "ego",
      "youtubeId": "Bxjk4rxJnkE",
      "duration": "43:36"
    },
    {
      "id": "dynamics",
      "title": "DYNAMICS: Satellite Scan Video Coaching",
      "lensType": "dynamics",
      "youtubeId": "DL3hhDqbfgU",
      "duration": "9:45"
    },
    {
      "id": "influence",
      "title": "INFLUENCE: Satellite Scan Video Coaching",
      "lensType": "influence",
      "youtubeId": "rVJvDT-9n5k",
      "duration": "37:42"
    },
    {
      "id": "attitude",
      "title": "ATTITUDE: Satellite Scan Video Coaching",
      "lensType": "attitude",
      "youtubeId": "xrkeazuA-Ck",
      "duration": "7:59"
    },
    {
      "id": "chaordic",
      "title": "CHAORDIC: Satellite Scan Video Coaching",
      "lensType": "chaordic",
      "youtubeId": "F8pLhU5Dc7s",
      "duration": "24:24"
    },
    {
      "id": "flow",
      "title": "FLOW: Satellite Scan Video Coaching",
      "lensType": "flow",
      "youtubeId": "mYavMqD1Tm0",
      "duration": "26:42"
    },
    {
      "id": "alignment",
      "title": "ALIGNMENT: Satellite Scan Video Coaching",
      "lensType": "alignment",
      "youtubeId": "vXc5OAJAQHM",
      "duration": "32:37"
    },
    {
      "id": "needs",
      "title": "NEEDS: Satellite Scan Video Coaching",
      "lensType": "needs",
      "youtubeId": "7CLTewj4W4g",
      "duration": "26:23"
    }
  ],
  "scienceOfCommunicationVideos": [
    {
      "id": "tedx",
      "title": "The green blue red movement: Esteve Pannetier at TEDxTurku",
      "lensType": null,
      "youtubeId": "mbdzgJHXb3Y",
      "duration": "20:37"
    },
    {
      "id": "attitude-change",
      "title": "2101 Attitude to Change: Balance learning with doing to embrace personal change",
      "lensType": "attitude",
      "youtubeId": "uM0Rf8bvYRA",
      "duration": "11:10"
    },
    {
      "id": "influence-strategies",
      "title": "1101 Influence Strategies: 3 Strategies of Communication to Lead with Respect",
      "lensType": "influence",
      "youtubeId": "-c3X1A3pOVI",
      "duration": "8:31"
    },
    {
      "id": "gbr-basics",
      "title": "1103 GreenBlueRed™ Basics: Upgrade your interactions by understanding the colours",
      "lensType": "influence",
      "youtubeId": "W7dzDkCUsgk",
      "duration": "11:23"
    },
    {
      "id": "congruence",
      "title": "5102 Congruence: 3 Levels of Communication is a new way to understand conversations",
      "lensType": "alignment",
      "youtubeId": "2KUgC9rNS5k",
      "duration": "28:24"
    },
    {
      "id": "green-empathy",
      "title": "Green Communication - The Power of Empathy",
      "lensType": "alignment",
      "youtubeId": "4UrH1lIqy-4",
      "duration": "31:52"
    },
    {
      "id": "blue-barriers",
      "title": "Blue Communication - The 5 Barriers of Communication",
      "lensType": "ego",
      "youtubeId": "YL8S0qn10aE",
      "duration": "52:46"
    },
    {
      "id": "conscious-feedback",
      "title": "4102 Conscious Feedback: How to give and receive conscious feedback at work",
      "lensType": "flow",
      "youtubeId": "ixwmT_avY3I",
      "duration": "18:35"
    },
    {
      "id": "measuring-flow",
      "title": "4101 Measuring Flow: How to measure communication flow in your work and with your team",
      "lensType": "flow",
      "youtubeId": "EZBP2FByWBg",
      "duration": "13:07"
    },
    {
      "id": "chaordic-balance",
      "title": "Chaordic Balance: What does 'chaordic' balance mean? 3101",
      "lensType": "chaordic",
      "youtubeId": "omq_x_mtqDE",
      "duration": "8:58"
    },
    {
      "id": "ego-triggers",
      "title": "Ego Triggers 7101 doodled live to Futuriceans in Berlin",
      "lensType": "ego",
      "youtubeId": "p-LhY1uPgMg",
      "duration": "10:43"
    },
    {
      "id": "chaordic-doodle",
      "title": "Chaordic Balance 3101 doodle live to Futuriceans in Berlin",
      "lensType": "chaordic",
      "youtubeId": "HFhzuFgdxjk",
      "duration": "12:57"
    },
    {
      "id": "alignment-conflicts",
      "title": "Alignment in Conflicts 5101 doodled live to Futuriceans in Berlin",
      "lensType": "alignment",
      "youtubeId": "kk6zfMZrZ8A",
      "duration": "6:21"
    },
    {
      "id": "functional-conflicts",
      "title": "Functional Conflicts 6104 doodled live to Futuriceans in Berlin",
      "lensType": "needs",
      "youtubeId": "tPZDOBHnziI",
      "duration": "5:18"
    },
    {
      "id": "end-boring-meetings",
      "title": "3201 The Secret to End Boring and Inefficient Meetings: how to invite meetings consciously",
      "lensType": "chaordic",
      "youtubeId": "Q0yNbBNx-HY",
      "duration": "35:34"
    }
  ]
} as const;

export function renderResourceVideoIndex(): string {
  const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
  const groups = [RESOURCE_VIDEOS.understandingYourDataVideos, RESOURCE_VIDEOS.scienceOfCommunicationVideos];
  return `<section class="ge-learning-copy ge-learning-video-index"><h2>Existing communication teaching videos</h2><p>These English videos support communication practice. AI training and coaching are booked separately.</p><ul>${groups.flat().map(video => `<li><a href="https://www.youtube.com/watch?v=${video.youtubeId}">${escape(video.title)}</a></li>`).join('')}</ul><p><a href="https://www.youtube.com/@greenelephantorg">Green Elephant on YouTube</a></p></section>`;
}
