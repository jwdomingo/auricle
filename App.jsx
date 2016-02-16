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
      messages: Channels.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Channels.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };
  },

  renderChannels() {
    return this.data.tasks.map((task) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return <Task
        key={task._id}
        task={task}
        showPrivateButton={showPrivateButton} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    var text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("addTask", text);

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
          <h1>Channels ({this.data.incompleteCount})</h1>

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
            <form className="new-task" onSubmit={this.handleSubmit} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks" />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderChannels()}
        </ul>
      </div>
    );
  }
});
