import React, {PropTypes} from 'react';
import classnames from 'classnames';
import style from './Panel.styl';

const Panel = React.createClass({

  propTypes: __DEV__ && {
    onChange: PropTypes.func,
    value: PropTypes.string,
    overflowY: PropTypes.bool,
    children: PropTypes.element.isRequired
  },

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
