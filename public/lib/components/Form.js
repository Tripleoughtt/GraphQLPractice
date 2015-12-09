import React from "react";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { titleValue: '', urlValue: '' };
  }
  changeInput(inputName, e) {
    this.setState({ [inputName]: e.target.value });
  }
  addBookmark(e) {
    e.preventDefault();
    let newBookmark = { title: this.state.titleValue,
                        url: this.state.urlValue };

    // invoke the insertBookmark(newBookmark);
    this.props.addBookmark(newBookmark);
    this.setState({titleValue: '', urlValue: ''});
  }
  render() {
    let {titleValue, urlValue} = this.state;
    return (
      <div className="form">
        <form onSubmit={this.addBookmark.bind(this)}>
        <input placeholder="Title" value={titleValue}
               onChange={this.changeInput.bind(this, "titleValue")} />
        <input placeholder="Url" value={urlValue}
               onChange={this.changeInput.bind(this, "urlValue")} />
        <button type="submit">Add Link</button>
        </form>
      </div>
    );
  }
}

export default Form;
