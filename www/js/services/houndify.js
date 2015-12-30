function houndify(commands, SERVER) {
  var self = this;
  this.commands = commands;

  var callback = function() {};

  this.onResponse = function(response, info) {
    console.log('response', response);
    if (
        response.AllResults && response.AllResults[0] !== undefined
        && response.AllResults[0].MatchedItem && response.AllResults[0].MatchedItem.Result) {
        callback(response.AllResults[0].MatchedItem.Result);
    } else {
    }
  };

  this.listen = function(fn, endFn) {
    callback = fn;
    this.startRecording();
    this.onRecordingStopped = endFn;
  };
  
  this.SERVER = SERVER;

  this.init();
}

houndify.prototype.startRecording = function() {
  var self = this;
  function createRequestInfo() {
    var settings = requestInfo;

    settings.ClientMatches = _.chain(_.pluck(self.commands.get(), 'id')).map(function(command) {
      return {
        'Expression': '"' + command + '"',
        'Result': command,
        'SpokenResponse': '',
        'SpokenResponseLong': '',
        'WrittenResponse': '',
        'WrittenResponseLong': ''
      }
    }).value();

    console.log('settings', settings);
    return settings;
  }

  var requestInfo = {
    PartialTranscriptsDesired: true,
    ClientID: "qI4u76zAmsMisKIOwleTjQ=="
  };

  console.log(this.voiceSearch.start(createRequestInfo()));
  console.log('vs', this.voiceSearch);
}

houndify.prototype.init = function() {
  var self = this;

  var myConversation = new Hound.Conversation();
  this.voiceSearch = new Hound.VoiceSearch({
    authenticationURI: this.SERVER.url + "/voiceSearchAuth",

    conversation: myConversation,

    enableVAD: false,

    onTranscriptionUpdate: function(trObj) {
      console.log(trObj.PartialTranscript);
    },

    onResponse: function(response, info) {
      self.onResponse(response, info);
    },

    onAbort: function(info) {
      console.error(info);
    },

    onError: function(err, info) {
      console.error(err, info);
    },

    onRecordingStarted: function() {
    },

    onRecordingStopped: function(recording) {
      console.log('ended');
      self.onRecordingStopped();
    },

    onAudioFrame: function(frame) {}

  });
};