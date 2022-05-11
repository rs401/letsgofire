import React from 'react';

function Reply({reply}){
  return (
    <div>
      <small>User: {reply.data().owner}</small>
      <h4>Message: {reply.data().message}</h4>
    </div>
  );
}

export default Reply;