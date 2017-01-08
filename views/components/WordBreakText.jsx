import React, { Component } from "react"

export default class WordBreakText extends Component {
  get defaultProps() {
    return {
      text: "",
      breakWord: " ",
    }

  }


  render() {
    const breakWord = this.props.breakWord;
    const textItems = this.props.text.split(breakWord);
    return (
      <p>
        {
         textItems.map(function(item, i) {
            if (i == 0) {
              return item;
            } else {
              return <x key={i}><wbr/>{breakWord + "" + item}</x>;
            }
          })
        }
      </p>
    )
  }
}