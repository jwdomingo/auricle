Messages = new Mongo.Collection("messages");
Channels = new Mongo.Collection("channels");
Media = new Mongo.Collection("media");

if (Meteor.isClient) {
  Accounts.ui.config({ passwordSignupFields: "USERNAME_ONLY" });
  Meteor.loginWithGithub();

  Meteor.subscribe("messages");
  Meteor.subscribe("channels");
  Meteor.subscribe("media");

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
    return Channels.find({});
  });

  Meteor.publish("media", function () {
    return Media.find({});
  });
}

Meteor.methods({
  createChannel(channelName, content, isPrivate) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("Not authorized to create new channels");
    }
    Channels.insert({
      channel: channelName,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      media: content,
      private: isPrivate
    });
  },

  getMedia(channel) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("Not authorized to fetch new media");
    }

    var url = 'https://api.soundcloud.com/tracks/?q=beyonce&license=cc-by-sa&client_id=' + Meteor.settings.public.soundcloudApiKey;

    return HTTP.getPromise(url)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        if (error) {
          console.error('Server side error', error);
        }
      });
  },

  createMedia(content) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("Not authorized to create new media");
    }
    Media.insert({
      title: content.title,
      creator: content.creator,
      type: content.type,
      thumb: content.thumb,
      source: content.source
    });
  },

  addMessage(text, channel) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("Not authorized to chat");
    }
    Messages.insert({
      content: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      channel: channel
    });
  },

  removeMessage(msgId) {
    const message = Messages.findOne(msgId);
    if (message.owner !== Meteor.userId()) {
      throw new Meteor.Error("Not authorized to delete messages");
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
