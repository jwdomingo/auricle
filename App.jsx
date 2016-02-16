App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      query = {checked: {$ne: true}};
    }

    return {
      channels: Channels.find({}).fetch(),
      messages: Messages.find(query, {sort: {createdAt: -1}}).fetch(),
      messageCount: Messages.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };
  },

  renderMessages() {
    return this.data.messages.map((message) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = message.owner === currentUserId;

      return <Message
        key={message._id}
        message={message}
        showPrivateButton={showPrivateButton} />;
    });
  },

  renderChannel() {
    if (!this.data.channels) {
      console.log('NO CHANNELS YET', this.data.channels);
      return;
    }
    return this.data.channels.map((content) => {
      return <Media
        key={content._id}
        channel={channels.channel} />;
    });
  },

  getMedia() {
    Meteor.call("getMedia", function(error, response) {
      if (error) {
        //console.error('Client side error');
      }
      Session.set('media', response);
    })
  },

  handleSubmit(event) {
    event.preventDefault();

    var text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("addMessage", text);

    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  },

  sideNav() {
    $(".button-collapse").sideNav();
  },

  render() {
    return (
      <div className="container">
        <header>
          <a href="#" onClick={this.getMedia}><h1>Auricle</h1></a>
          <AccountsUIWrapper />

          <div id="channel">
            {this.renderChannel()}
          </div>

          <h4>Messages ({this.data.messageCount})</h4>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Completed
          </label>


          { this.data.currentUser ?
            <form className="new-message" onSubmit={this.handleSubmit} >
              <input
                type="text"
                ref="textInput"
                placeholder="Enter message" />
            </form> : ''
          }
        </header>

        <aside className="hide-on-small-only">
          <ul id="slide-out" className="side-nav fixed">
            <li><h4>Channels</h4></li>
            <li className="teal"><input/></li>
            <li><a href="#">Channel 1</a></li>
            <li><a href="#">Channel 2</a></li>
          </ul>
        </aside>
        <main>
          <ul className="collection">
            {this.renderMessages()}
          </ul>
        </main>
      </div>
    );
  }
});
