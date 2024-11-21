import React from 'react';

const withAnimation = (WrappedComponent) => {
  return function WithAnimation(props) {
    return (
      <div className="ui-component-animation">
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withAnimation;