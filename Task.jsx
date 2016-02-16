Message = React.createClass({
  propTypes: {
    message: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
  },

  toggleChecked() {
    Meteor.call("setChecked", this.props.message._id, !this.props.message.checked);
  },

  deleteMessage() {
    Meteor.call("removeMessage", this.props.message._id);
  },

  togglePrivate() {
    Meteor.call("setPrivate", this.props.message._id, ! this.props.message.private);
  },

  render() {
    const msgClass = (this.props.message.checked ? "checked" : "") + " " +
      (this.props.message.private ? "private" : "");

    return (
      <li className={msgClass}>
        { this.props.message.owner === Meteor.userId() ? (
          <button className="right" onClick={this.deleteMessage}>
          &times;
          </button>
        ) : '' }

        { this.props.message.owner === Meteor.userId() ? (
          <input
            type="checkbox"
            className="right"
            readOnly={true}
            checked={this.props.message.checked}
            onClick={this.toggleChecked} />
          ) : '' }

          { this.props.showPrivateButton ? (
            <button className="right" onClick={this.togglePrivate}>
              { this.props.message.private ? "Private" : "Public" }
            </button>
          ) : '' }

          <span className="text">
            <strong>{this.props.message.username}</strong>: {this.props.message.content}
          </span>
      </li>
    )
  }
});
