import React from 'react';
import Select from 'react-select';
import sortOptions from '../constants/sortOptions';

function SortingBar({ selectedSortOption, selectSortOption, reverseOrder }) {
  return (
    <div>
      <div>Sort order:</div>
      <Select
        value={selectedSortOption}
        options={sortOptions}
        onChange={selectSortOption}
      />
      <button onClick={reverseOrder}>
        Reverse order
      </button>
    </div>
  );
}

export default SortingBar;
