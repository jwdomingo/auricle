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
      <li className={msgClass + ' collection-item avatar message-item'}>
        <img src="assets/auricle.svg" alt="avatar" className="circle"></img>
        <div className="row message-row">
          <span className="title col s10">{this.props.message.username}</span>
          <p className="col s10">{this.props.message.content}</p>
        </div>

        { this.props.message.owner === Meteor.userId() ? (
          <span className="message-icons">
            <a className="secondary-content" href="#">
              <i className="tiny material-icons message-icons">edit</i>
              <i onClick={this.deleteMessage} className="tiny material-icons message-icons">delete</i>
              { this.props.showPrivateButton ? (
                <i className="tiny material-icons message-icons" onClick={this.togglePrivate}>
                  { this.props.message.private ? "lock" : "lock_open" }
                </i>
              ) : '' }
            </a>
          </span>
        ) : '' }

        { this.props.message.owner === Meteor.userId() ? (
          <input
            type="checkbox"
            className="right"
            readOnly={true}
            checked={this.props.message.checked}
            onClick={this.toggleChecked} />
          ) : '' }
      </li>
    )
  }
});
