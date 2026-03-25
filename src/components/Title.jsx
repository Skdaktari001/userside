import React from 'react';

const Title = ({ text1, text2 }) => { // Destructure the props here
  return (
    <div className="inline-flex gap-3 items-center mb-6">
      <h2 className="text-2xl sm:text-3xl font-light tracking-[0.2em] text-secondary uppercase">
        {text1} <span className="font-medium">{text2}</span>
      </h2>
      <div className="w-12 h-[1px] bg-secondary opacity-30"></div>
    </div>
  );
};

export default Title;
