import React from 'react';
import styled from 'styled-components';
import { omit } from 'lodash';

const Div = styled.div`
  margin: 20px;
`;

function ListItem({ item, style, setSimilarItem, setSimilarButtonText }) {
  return (
    <Div style={style}>
      <pre>
        {JSON.stringify(omit(item, ['id']), null, 4)}
      </pre>
      <button onClick={setSimilarItem}>
        {setSimilarButtonText}
      </button>
    </Div>
  );
}

export default ListItem;
