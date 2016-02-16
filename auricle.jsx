Messages = new Mongo.Collection("messages");
Channels = new Mongo.Collection("channels");

if (Meteor.isClient) {
  Accounts.ui.config({ passwordSignupFields: "USERNAME_ONLY" });
  Meteor.loginWithGithub();

  Meteor.subscribe("messages");
  Meteor.subscribe("channels");

  Meteor.startup(function () {
    ReactDOM.render(<App />, document.getElementById("render-target"));
  });
}

if (Meteor.isServer) {
  Meteor.publish("messages", function () {
    return Messages.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

  Meteor.publish("channels", function () {
    return Channels.find({
      owner: this.userId
    });
  });
}

Meteor.methods({
  addMessage(text, channel) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Messages.insert({
      message: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      channel: channel
    });
  },

  removeMessage(msgId) {
    const message = Messages.findOne(msgId);
    if (message.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Messages.remove(msgId);
  },

  setChecked(msgId, setChecked) {
    const message = Messages.findOne(msgId);
    if (message.owner !== Meteor.userId()) {
      throw new Meteor.Error("Not authorized to check off message");
    }
    Messages.update(msgId, { $set: { checked: setChecked} });
  },

  setPrivate(msgId, setToPrivate) {
    const message = Messages.findOne(msgId);
    if (message.owner !== Meteor.userId()) {
      throw new Meteor.Error("Not authorized to set message to privates");
    }
    Messages.update(msgId, { $set: { private: setToPrivate } });
  }
});
