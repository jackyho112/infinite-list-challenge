import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import sortOptions from '../constants/sortOptions';

const Button = styled.button`
  margin-top: 5px;
`;

function SortingBar({ selectedSortOption, selectSortOption, reverseOrder }) {
  return (
    <div>
      <div>Sort order:</div>
      <Select
        value={selectedSortOption}
        options={sortOptions}
        onChange={selectSortOption}
      />
      <Button onClick={reverseOrder}>
        Reverse order
      </Button>
    </div>
  );
}

export default SortingBar;
