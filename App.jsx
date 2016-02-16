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
      messages: Messages.find(query, {sort: {createdAt: -1}}).fetch(),
      messageCount: Messages.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };
  },

  renderMessages() {
    return this.data.messages.map((message) => {
      console.log('this.data.currentUser',this.data.currentUser);
      console.log('this.data.currentUser._id',this.data.currentUser._id);
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = message.owner === currentUserId;

      return <Message
        key={message._id}
        message={message}
        showPrivateButton={showPrivateButton} />;
    });
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

  render() {
    return (
      <div className="container">
        <header>
          <h1>Messages ({this.data.messageCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Completed
          </label>

          <AccountsUIWrapper />

          { this.data.currentUser ?
            <form className="new-message" onSubmit={this.handleSubmit} >
              <input
                type="text"
                ref="textInput"
                placeholder="Enter message" />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderMessages()}
        </ul>
      </div>
    );
  }
});
