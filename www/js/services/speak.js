function speak() {
  var self = this;

  return self;
}

speak.prototype.say = function(text) {
  responsiveVoice.speak(text, 'US English Female');
  console.log('SAY', text);
}