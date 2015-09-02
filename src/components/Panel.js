import React from 'react';
import style from './Panel.styl'
import classnames from 'classnames';

const Panel = React.createClass({

  render() {
    const cssClasses = classnames({
      'col': true,
      'col-6': true,
      [style.overflowScroll]: !this.props.overflowY,
      [style.overflowYScroll]: this.props.overflowY
    });
    return (
      <div
        className={cssClasses}
      >
        {this.props.children}
      </div>
    );
  }
});

export default Panel;
