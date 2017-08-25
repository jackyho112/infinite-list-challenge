import React from 'react';
import styled from 'styled-components';
import ListItem from './ListItem';

const Button = styled.button`
  margin-left: 10px;
`;

function SimilarItemInfo({ similarToItem, resetSimilarItem }) {
  return (
    <div>
      <br />
      {`Displaying results with square footage similar to ${similarToItem.name}'s`}
      <Button onClick={resetSimilarItem}>
        Display all
      </Button>
    </div>
  );
}

export default SimilarItemInfo;
